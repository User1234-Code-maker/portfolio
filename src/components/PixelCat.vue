<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLang } from '../composables/useLang'
import { reducedMotion } from '../utils/pageScroll'
import catUrl from '../assets/img/cat.png'

// Котик-пасхалка. Живёт сам: выглядывает с краёв, гуляет по низу экрана, спит, если ты затих,
// подпрыгивает рядом с курсором, иногда выпрыгивает из-под нижнего края, а когда ловишь звезду,
// бежит к ней. Поглаживание (клик) даёт сердечки, а серия кликов запускает «зумис».
const route = useRoute()
const { t } = useLang()

const el = ref<HTMLElement | null>(null)
const x = ref(-200)
const y = ref(-200)
const flip = ref(false)
const mode = ref<'hidden' | 'out' | 'walk' | 'sleep' | 'zoom' | 'jump'>('hidden')
const hop = ref(false)
const said = ref('')
const hearts = ref<{ id: number; dx: number }[]>([])
const scrolled = ref(false)
const dur = ref(1.4)

const visible = computed(() => route.name !== 'home' || scrolled.value)
const size = () => (window.innerWidth <= 700 ? 48 : 64)
const height = () => (size() * 294) / 342

let timers: number[] = []
let sayTimer = 0
let pets = 0
let petTimer = 0
let lastMove = Date.now()
let heartId = 0
let busy = false
let px = 0
let py = 0
let dodge = 0

const later = (fn: () => void, ms: number) => {
  const id = window.setTimeout(fn, ms)
  timers.push(id)
  return id
}
const clearTimers = () => {
  timers.forEach(window.clearTimeout)
  timers = []
}
const rand = (a: number, b: number) => a + Math.random() * (b - a)

function speak(msg: string, ms = 1700) {
  said.value = msg
  window.clearTimeout(sayTimer)
  sayTimer = window.setTimeout(() => (said.value = ''), ms)
}
function jump() {
  if (reducedMotion()) return
  hop.value = false
  requestAnimationFrame(() => (hop.value = true))
}
function goto(nx: number, ny: number, seconds: number, m: typeof mode.value = 'walk') {
  flip.value = nx < x.value
  dur.value = seconds
  mode.value = m
  x.value = nx
  y.value = ny
}

// заготовки мест: прячется за краем экрана или стоит на нижней кромке
const edgeSpot = (side: 'l' | 'r', out: boolean) => {
  const s = size()
  const hidden = out ? 0.18 : 0.66
  return {
    x: side === 'r' ? window.innerWidth - s * (1 - hidden) : -s * hidden,
    y: rand(0.28, 0.72) * window.innerHeight,
  }
}
const floor = (xx: number) => ({ x: xx, y: window.innerHeight - height() + 4 })

function peek() {
  const side = Math.random() < 0.5 ? 'l' : 'r'
  const hiddenSpot = edgeSpot(side, false)
  goto(hiddenSpot.x, hiddenSpot.y, 1.1)
  later(() => {
    mode.value = 'out'
    const s = size()
    x.value = side === 'r' ? window.innerWidth - s * 0.95 : -s * 0.05
    dur.value = 0.5
    jump()
  }, 1500)
  later(() => {
    if (!busy) {
      x.value = side === 'r' ? window.innerWidth - s0() * 0.34 : -s0() * 0.66
      mode.value = 'hidden'
    }
  }, 5200)
}
const s0 = size

function stroll() {
  const f = floor(rand(0.1, 0.85) * window.innerWidth)
  goto(f.x, f.y, rand(2.2, 3.6))
  later(() => (mode.value = 'out'), 3800)
}

// выпрыгивает из-под нижнего края прямо под курсором
function ambush() {
  if (reducedMotion()) return
  const f = floor(Math.min(window.innerWidth - size(), Math.max(0, px - size() / 2)))
  goto(f.x, window.innerHeight + 10, 0.01)
  later(() => {
    mode.value = 'jump'
    goto(f.x, f.y - 90, 0.32, 'jump')
    speak(t('cat_line_1'), 1300)
  }, 80)
  later(() => goto(f.x, f.y, 0.42, 'out'), 480)
  later(() => peek(), 3600)
}

function schedule() {
  later(
    () => {
      if (!visible.value || busy || mode.value === 'sleep') return schedule()
      const r = Math.random()
      if (r < 0.34) peek()
      else if (r < 0.66) stroll()
      else if (r < 0.8) ambush()
      else jump()
      schedule()
    },
    rand(5200, 9000),
  )
}

function sleepCheck() {
  if (!visible.value || busy) return
  if (Date.now() - lastMove > 22000 && mode.value !== 'sleep') {
    const f = floor(rand(0.2, 0.8) * window.innerWidth)
    goto(f.x, f.y + 10, 2.4)
    later(() => {
      mode.value = 'sleep'
      speak(t('cat_zzz'), 3000)
    }, 2600)
  }
}

function wake() {
  lastMove = Date.now()
  if (mode.value === 'sleep') {
    mode.value = 'out'
    jump()
    speak(t('cat_line_4'), 1000)
  }
}

function onMove(e: PointerEvent) {
  px = e.clientX
  py = e.clientY
  wake()
  const r = el.value?.getBoundingClientRect()
  if (!r || !visible.value || busy || reducedMotion()) return
  const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2))
  if (d < 80 && !hop.value) {
    jump()
    dodge += 1
    // иногда убегает от курсора, но не всегда
    if (dodge % 3 === 0) {
      const f = floor(rand(0.1, 0.85) * window.innerWidth)
      goto(f.x, f.y, 0.7)
    }
  }
}

function pet() {
  pets += 1
  window.clearTimeout(petTimer)
  petTimer = window.setTimeout(() => (pets = 0), 6000)
  wake()
  jump()
  const lines = [t('cat_pet_1'), t('cat_pet_2'), t('cat_pet_3')]
  speak(lines[Math.min(pets - 1, lines.length - 1)] ?? t('cat_pet_1'))
  for (let i = 0; i < 3; i++) {
    const id = ++heartId
    hearts.value.push({ id, dx: rand(-26, 26) })
    window.setTimeout(() => (hearts.value = hearts.value.filter((h) => h.id !== id)), 1100)
  }
  if (pets >= 5) {
    pets = 0
    zoomies()
  }
}

// серия кликов: кот несётся через весь экран и обратно,
function zoomies() {
  if (reducedMotion()) return
  busy = true
  clearTimers()
  speak(t('cat_zoom'), 2600)
  const W = window.innerWidth
  const runs = [0.9, 0.05, 0.85, 0.15, 0.7]
  runs.forEach((k, i) =>
    later(() => {
      const f = floor(k * (W - size()))
      goto(f.x, f.y - (i % 2) * 40, 0.42, 'zoom')
    }, i * 460),
  )
  later(
    () => {
      busy = false
      peek()
      schedule()
    },
    runs.length * 460 + 400,
  )
}

const onScroll = () => (scrolled.value = window.scrollY > window.innerHeight * 0.9)

let sleepInt = 0
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('keydown', wake)
  const f = edgeSpot(Math.random() < 0.5 ? 'l' : 'r', false)
  x.value = f.x
  y.value = f.y
  if (!reducedMotion()) {
    later(peek, 1600)
    schedule()
    sleepInt = window.setInterval(sleepCheck, 4000)
  } else {
    mode.value = 'out'
    x.value = window.innerWidth - size() * 0.95
  }
})
onBeforeUnmount(() => {
  clearTimers()
  clearInterval(sleepInt)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('keydown', wake)
})
</script>

<template>
  <div
    v-show="visible"
    ref="el"
    class="pcat"
    :class="[`m-${mode}`, { hop, flip }]"
    :style="{ '--x': `${x}px`, '--y': `${y}px`, '--d': `${dur}s`, '--s': `${size()}px` }"
  >
    <span v-if="said" class="pcat-say" role="status">{{ said }}</span>
    <span
      v-for="h in hearts"
      :key="h.id"
      class="pcat-heart"
      :style="{ '--dx': `${h.dx}px` }"
      aria-hidden="true"
      >♥</span
    >
    <span v-if="mode === 'sleep'" class="pcat-z" aria-hidden="true"><i>z</i><i>z</i><i>Z</i></span>
    <button
      type="button"
      class="pcat-btn"
      :aria-label="t('cat_hint')"
      @click="pet"
      @animationend="hop = false"
    >
      <img :src="catUrl" alt="" width="342" height="294" decoding="async" />
    </button>
  </div>
</template>

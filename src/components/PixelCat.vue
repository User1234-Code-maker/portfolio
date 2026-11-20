<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLang } from '../composables/useLang'
import { reducedMotion } from '../utils/pageScroll'
import catUrl from '../assets/img/cat.png'

// Пасхалка: котик на внутренних страницах. Сидит в своём месте, выглядывает с края,
// мяукает по клику, засыпает, если его долго не трогать. Его можно взять и перенести куда угодно:
// пока несёшь, он кричит «ааа». Стрелки на клавиатуре тоже двигают его.
const route = useRoute()
const { t } = useLang()

type Spot = { side: 'left' | 'right'; bottom: string; peek: boolean }
const spots: Record<string, Spot> = {
  projects: { side: 'right', bottom: '22vh', peek: true },
  project: { side: 'left', bottom: '0px', peek: false },
  music: { side: 'left', bottom: '34vh', peek: true },
  about: { side: 'right', bottom: '0px', peek: false },
  contact: { side: 'right', bottom: '46vh', peek: true },
  'not-found': { side: 'left', bottom: '0px', peek: false },
}
const spot = computed(() => spots[String(route.name)])

const el = ref<HTMLElement | null>(null)
const hop = ref(false)
const said = ref('')
const out = ref(false)
const free = ref(false) // котика уже перетащили: он живёт там, куда его положили
const dragging = ref(false)
const sleepy = ref(false)
const below = ref(false) // у верхнего края пузырь рисуется под котиком
let sayTimer = 0
let screamTimer = 0
let sleepTimer = 0
let raf = 0
let moveRaf = 0

// Координаты хранятся обычными переменными и пишутся в style напрямую:
// во время переноса Vue ничего не перерисовывает.
let px = 0
let py = 0
let startX = 0
let startY = 0
let grabX = 0
let grabY = 0
let pressed = false
let moved = false

const lines = ['cat_line_1', 'cat_line_2', 'cat_line_3', 'cat_line_4']
const screams = ['cat_scream_1', 'cat_scream_2', 'cat_scream_3']
const landings = ['cat_land_1', 'cat_land_2', 'cat_land_3']
const pick = (list: string[]) => t(list[Math.floor(Math.random() * list.length)]!)

function sayFor(text: string, ms: number) {
  said.value = text
  window.clearTimeout(sayTimer)
  sayTimer = window.setTimeout(() => (said.value = ''), ms)
}
function say() {
  sayFor(pick(lines), 1800)
  jump()
}
function jump() {
  if (reducedMotion()) return
  hop.value = false
  requestAnimationFrame(() => (hop.value = true))
}

// Ленивый котик: если его долго не трогать, он засыпает. Будит клик, перенос или курсор рядом.
function rest() {
  sleepy.value = false
  window.clearTimeout(sleepTimer)
  sleepTimer = window.setTimeout(() => {
    if (!dragging.value) sleepy.value = true
  }, 30000)
}

function place() {
  if (!el.value) return
  el.value.style.transform = `translate3d(${px}px, ${py}px, 0)`
  const nearTop = py < 56
  if (nearTop !== below.value) below.value = nearTop
}
function clamp() {
  const box = el.value
  if (!box) return
  px = Math.min(Math.max(0, px), Math.max(0, window.innerWidth - box.offsetWidth))
  py = Math.min(Math.max(0, py), Math.max(0, window.innerHeight - box.offsetHeight))
}

function onDown(e: PointerEvent) {
  if (e.button !== 0 || !el.value) return
  const r = el.value.querySelector('img')!.getBoundingClientRect()
  pressed = true
  moved = false
  startX = e.clientX
  startY = e.clientY
  grabX = e.clientX - r.left
  grabY = e.clientY - r.top
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  rest()
}

function startDrag() {
  const box = el.value
  if (!box) return
  const r = box.querySelector('img')!.getBoundingClientRect()
  free.value = true
  dragging.value = true
  hop.value = false
  out.value = false
  sleepy.value = false
  px = r.left
  py = r.top
  place()
  screamLoop()
}

// Пока котика несут, он орёт «ааа»: фраза меняется раз в ~0,7 с, больше ничего не крутится.
function screamLoop() {
  window.clearTimeout(sayTimer)
  said.value = pick(screams)
  screamTimer = window.setTimeout(screamLoop, 700)
}

function onMoveDrag(e: PointerEvent) {
  if (!pressed) return
  if (!moved) {
    if (Math.hypot(e.clientX - startX, e.clientY - startY) < 6) return
    moved = true
    startDrag()
  }
  px = e.clientX - grabX
  py = e.clientY - grabY
  if (moveRaf) return
  moveRaf = requestAnimationFrame(() => {
    moveRaf = 0
    clamp()
    place()
  })
}

function onUp() {
  if (!pressed) return
  pressed = false
  if (!moved) return say()
  window.clearTimeout(screamTimer)
  cancelAnimationFrame(moveRaf)
  moveRaf = 0
  clamp()
  place()
  dragging.value = false
  sayFor(pick(landings), 1600)
  rest()
}

function onKey(e: KeyboardEvent) {
  const dir: Record<string, [number, number]> = {
    ArrowLeft: [-24, 0],
    ArrowRight: [24, 0],
    ArrowUp: [0, -24],
    ArrowDown: [0, 24],
  }
  const d = dir[e.key]
  if (!d || !el.value) return
  e.preventDefault()
  if (!free.value) {
    const r = el.value.querySelector('img')!.getBoundingClientRect()
    px = r.left
    py = r.top
    free.value = true
  }
  px += d[0]
  py += d[1]
  clamp()
  place()
  sayFor(pick(screams), 900)
  rest()
}

function onMove(e: PointerEvent) {
  if (free.value || !el.value || raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const r = el.value?.getBoundingClientRect()
    if (!r) return
    const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
    // «высовывается» с края, когда курсор подошёл ближе; подпрыгивает, когда совсем рядом
    out.value = d < 170
    if (d < 90) {
      if (sleepy.value) rest()
      if (!hop.value) jump()
    }
  })
}

function onResize() {
  if (!free.value) return
  clamp()
  place()
}

onMounted(() => {
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  rest()
})
onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('resize', onResize)
  cancelAnimationFrame(raf)
  cancelAnimationFrame(moveRaf)
  window.clearTimeout(sayTimer)
  window.clearTimeout(screamTimer)
  window.clearTimeout(sleepTimer)
})
watch(
  () => route.name,
  () => {
    out.value = false
    said.value = ''
  },
)
</script>

<template>
  <div
    v-if="spot"
    ref="el"
    class="pcat"
    :class="[`s-${spot.side}`, { peek: spot.peek && !free, out, hop, free, dragging, sleepy, below }]"
    :style="free ? undefined : { bottom: spot.bottom }"
  >
    <span v-if="said" class="pcat-say" :class="{ scream: dragging }" role="status">{{ said }}</span>
    <span v-else-if="sleepy" class="pcat-say zz" aria-hidden="true">{{ t('cat_zzz') }}</span>
    <button
      type="button"
      class="pcat-btn"
      :aria-label="t('cat_hint')"
      @pointerdown="onDown"
      @pointermove="onMoveDrag"
      @pointerup="onUp"
      @pointercancel="onUp"
      @keydown="onKey"
      @animationend="hop = false"
    >
      <img :src="catUrl" alt="" width="342" height="294" decoding="async" draggable="false" />
    </button>
  </div>
</template>

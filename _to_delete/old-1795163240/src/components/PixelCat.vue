<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLang } from '../composables/useLang'
import { reducedMotion } from '../utils/pageScroll'
import catUrl from '../assets/img/cat.png'

// Пасхалка: котик на внутренних страницах. На каждой странице сидит в своём месте,
// выглядывает с края экрана, подпрыгивает, когда курсор рядом, и мяукает по клику.
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
let sayTimer = 0
let raf = 0

const lines = ['cat_line_1', 'cat_line_2', 'cat_line_3', 'cat_line_4']
function say() {
  said.value = t(lines[Math.floor(Math.random() * lines.length)]!)
  window.clearTimeout(sayTimer)
  sayTimer = window.setTimeout(() => (said.value = ''), 1800)
  jump()
}
function jump() {
  if (reducedMotion()) return
  hop.value = false
  requestAnimationFrame(() => (hop.value = true))
}

function onMove(e: PointerEvent) {
  if (!el.value || raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const r = el.value?.getBoundingClientRect()
    if (!r) return
    const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2))
    // «высовывается» с края, когда курсор подошёл ближе; подпрыгивает, когда совсем рядом
    out.value = d < 170
    if (d < 90 && !hop.value) jump()
  })
}

onMounted(() => {
  window.addEventListener('pointermove', onMove, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onMove)
  cancelAnimationFrame(raf)
  window.clearTimeout(sayTimer)
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
    :class="[`s-${spot.side}`, { peek: spot.peek, out, hop }]"
    :style="{ bottom: spot.bottom }"
  >
    <span v-if="said" class="pcat-say" role="status">{{ said }}</span>
    <button
      type="button"
      class="pcat-btn"
      :aria-label="t('cat_hint')"
      @click="say"
      @animationend="hop = false"
    >
      <img :src="catUrl" alt="" width="342" height="294" decoding="async" />
    </button>
  </div>
</template>

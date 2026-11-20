import { ref, watch } from 'vue'

// Общее состояние мини-игры: сколько звёзд поймано, включён ли секретный режим.
// Слои (StarField, котик, звёзды в Hero) общаются через небольшую шину событий.
export const TOTAL_STARS = 12
const KEY = 'stars-v1'
const RAINBOW = 'rainbow-v1'

const read = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* без localStorage игра просто не запоминается */
  }
}

export const stars = ref(Math.min(TOTAL_STARS, Number(read(KEY)) || 0))
export const rainbow = ref(read(RAINBOW) === '1' && stars.value >= TOTAL_STARS)
export const toast = ref('')

export const bus = new EventTarget()
export type CollectDetail = { x: number; y: number }
export type BurstDetail = { x: number; y: number; n: number }

let toastTimer = 0
export function say(msg: string, ms = 2600) {
  toast.value = msg
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), ms)
}

/** звезда поймана в точке (x, y) окна */
export function collect(x: number, y: number) {
  const before = stars.value
  if (stars.value < TOTAL_STARS) stars.value += 1
  bus.dispatchEvent(new CustomEvent<CollectDetail>('collect', { detail: { x, y } }))
  burst(x, y, 14)
  return { count: stars.value, unlocked: before < TOTAL_STARS && stars.value >= TOTAL_STARS }
}

export function burst(x: number, y: number, n = 8) {
  bus.dispatchEvent(new CustomEvent<BurstDetail>('burst', { detail: { x, y, n } }))
}

export function toggleRainbow() {
  if (stars.value < TOTAL_STARS) return
  rainbow.value = !rainbow.value
}

watch(stars, (v) => write(KEY, String(v)))
watch(
  rainbow,
  (v) => {
    document.documentElement.classList.toggle('rainbow', v)
    write(RAINBOW, v ? '1' : '0')
  },
  { immediate: true },
)

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLang } from '../composables/useLang'
import {
  bus,
  collect,
  rainbow,
  say,
  stars,
  toast,
  toggleRainbow,
  TOTAL_STARS,
  type BurstDetail,
} from '../composables/useStars'
import { reducedMotion } from '../utils/pageScroll'

// Игровой слой поверх страницы: искры за курсором, звёзды, которые можно поймать, и вспышки.
// Холст не ловит события (pointer-events: none), клик по звезде перехватываем сами.
const { t } = useLang()
const route = useRoute()
const canvas = ref<HTMLCanvasElement | null>(null)
const pulse = ref(false)

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  age: number
  life: number
  size: number
  tone: number
  spin: number
}
interface Orb {
  x: number
  y: number
  vx: number
  t: number
  baseY: number
  size: number
  tone: number
}

const PALETTE = ['#ffffff', '#BFD3FF', '#C8B6FF', '#FFC9F0', '#A9F0FF']
const sparks: Spark[] = []
const orbs: Orb[] = []
const sprites: HTMLCanvasElement[] = []
let ctx: CanvasRenderingContext2D | null = null
let W = 0
let H = 0
let dpr = 1
let raf = 0
let last = 0
let nextOrb = 3500
let lastX = -999
let lastY = -999
let tone = 0
let hue = 0

function makeSprite(color: string) {
  const s = document.createElement('canvas')
  s.width = s.height = 64
  const c = s.getContext('2d')
  if (!c) return s
  const g = c.createRadialGradient(32, 32, 2, 32, 32, 30)
  g.addColorStop(0, color)
  g.addColorStop(0.28, color + '99')
  g.addColorStop(1, color + '00')
  c.fillStyle = g
  c.fillRect(0, 0, 64, 64)
  c.fillStyle = '#fff'
  c.beginPath()
  const R = 15
  const r = 3.2
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i - Math.PI / 2
    const rad = i % 2 === 0 ? R : r
    c.lineTo(32 + Math.cos(a) * rad, 32 + Math.sin(a) * rad)
  }
  c.closePath()
  c.fill()
  return s
}

// на главной, пока виден Hero, летающих звёзд нет: макет остаётся чистым
const orbsAllowed = () => route.name !== 'home' || window.scrollY > window.innerHeight * 0.8

function resize() {
  if (!canvas.value) return
  dpr = Math.min(2, window.devicePixelRatio || 1)
  W = window.innerWidth
  H = window.innerHeight
  canvas.value.width = Math.round(W * dpr)
  canvas.value.height = Math.round(H * dpr)
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function addSpark(x: number, y: number, speed = 40, size = 12, life = 0.75) {
  if (sparks.length > 160) sparks.shift()
  const a = Math.random() * Math.PI * 2
  const v = Math.random() * speed
  sparks.push({
    x,
    y,
    vx: Math.cos(a) * v,
    vy: Math.sin(a) * v - 10,
    age: 0,
    life: life * (0.7 + Math.random() * 0.6),
    size: size * (0.6 + Math.random() * 0.7),
    tone: rainbow.value ? 5 + ((hue += 37) % 360) : tone++ % PALETTE.length,
    spin: (Math.random() - 0.5) * 4,
  })
}

function spriteFor(tn: number) {
  if (tn >= 5) {
    const h = tn - 5
    const key = 5 + Math.round(h / 40)
    if (!sprites[key]) sprites[key] = makeSprite(hslHex(key * 40))
    return sprites[key]!
  }
  return sprites[tn]!
}
function hslHex(h: number) {
  const a = 0.9
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const v = 0.5 - a * 0.5 * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(v * 255)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function spawnOrb() {
  const fromLeft = Math.random() < 0.5
  const baseY = H * (0.2 + Math.random() * 0.6)
  orbs.push({
    x: fromLeft ? -30 : W + 30,
    baseY,
    y: baseY,
    vx: (fromLeft ? 1 : -1) * (34 + Math.random() * 30),
    t: Math.random() * 6,
    size: 26 + Math.random() * 8,
    tone: Math.floor(Math.random() * PALETTE.length),
  })
}

function frame(now: number) {
  raf = requestAnimationFrame(frame)
  if (!ctx) return
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  ctx.clearRect(0, 0, W, H)

  nextOrb -= dt * 1000
  if (nextOrb <= 0) {
    nextOrb = 6500 + Math.random() * 5000
    if (orbs.length < 2 && orbsAllowed() && stars.value < TOTAL_STARS + 40) spawnOrb()
  }

  for (let i = orbs.length - 1; i >= 0; i--) {
    const o = orbs[i]!
    o.t += dt
    o.x += o.vx * dt
    o.y = o.baseY + Math.sin(o.t * 1.5) * 34
    if (o.x < -60 || o.x > W + 60) {
      orbs.splice(i, 1)
      continue
    }
    if (Math.random() < dt * 8) addSpark(o.x, o.y, 18, 7, 0.55)
    const near = Math.hypot(lastX - o.x, lastY - o.y) < 60
    const s = o.size * (near ? 1.35 : 1) * (1 + Math.sin(o.t * 5) * 0.08)
    ctx.globalAlpha = 1
    ctx.save()
    ctx.translate(o.x, o.y)
    ctx.rotate(Math.sin(o.t * 2) * 0.2)
    ctx.drawImage(
      spriteFor(rainbow.value ? 5 + Math.round(((o.t * 60) % 360) / 40) * 40 : o.tone),
      -s,
      -s,
      s * 2,
      s * 2,
    )
    ctx.restore()
  }

  for (let i = sparks.length - 1; i >= 0; i--) {
    const p = sparks[i]!
    p.age += dt
    if (p.age >= p.life) {
      sparks.splice(i, 1)
      continue
    }
    p.x += p.vx * dt
    p.y += p.vy * dt
    p.vy += 26 * dt
    const k = 1 - p.age / p.life
    ctx.globalAlpha = k
    const s = p.size * (0.4 + k * 0.8)
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.age * p.spin)
    ctx.drawImage(spriteFor(p.tone), -s, -s, s * 2, s * 2)
    ctx.restore()
  }
  ctx.globalAlpha = 1
}

function onMove(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  lastX = e.clientX
  lastY = e.clientY
  if (Math.hypot(e.clientX - tx, e.clientY - ty) > 16) {
    tx = e.clientX
    ty = e.clientY
    addSpark(e.clientX, e.clientY, 34, 11, 0.7)
  }
}
let tx = -999
let ty = -999

// три звезды в Hero тоже можно поймать: вид не меняется, звезда прячется и возвращается через 18 с
function heroStar(e: MouseEvent) {
  for (const el of document.querySelectorAll<HTMLElement>('.deco.sp1,.deco.sp2,.deco.sp3')) {
    if (el.classList.contains('got')) continue
    const r = el.getBoundingClientRect()
    if (r.bottom < 0 || r.top > H) continue
    if (
      Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) <
      Math.max(r.width, 36) * 0.8
    ) {
      el.classList.add('got')
      window.setTimeout(() => el.classList.remove('got'), 18000)
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }
  }
  return null
}

function caught(x: number, y: number) {
  const { count, unlocked } = collect(x, y)
  pulse.value = false
  requestAnimationFrame(() => (pulse.value = true))
  say(unlocked ? t('stars_all') : `${t('stars_found')} · ${count}/${TOTAL_STARS}`, unlocked ? 4200 : 1800)
}

function onClick(e: MouseEvent) {
  const hs = heroStar(e)
  if (hs) {
    e.preventDefault()
    e.stopPropagation()
    caught(hs.x, hs.y)
    return
  }
  for (let i = orbs.length - 1; i >= 0; i--) {
    const o = orbs[i]!
    if (Math.hypot(e.clientX - o.x, e.clientY - o.y) < o.size + 22) {
      e.preventDefault()
      e.stopPropagation()
      orbs.splice(i, 1)
      caught(o.x, o.y)
      return
    }
  }
  if (!reducedMotion()) for (let i = 0; i < 5; i++) addSpark(e.clientX, e.clientY, 80, 10, 0.6)
}

function onBurst(e: Event) {
  const { x, y, n } = (e as CustomEvent<BurstDetail>).detail
  for (let i = 0; i < n; i++) addSpark(x, y, 130, 13, 0.9)
}

function start() {
  if (raf || document.hidden) return
  last = performance.now()
  raf = requestAnimationFrame(frame)
}
function stop() {
  cancelAnimationFrame(raf)
  raf = 0
}
const onVis = () => (document.hidden ? stop() : start())

onMounted(() => {
  ctx = canvas.value?.getContext('2d') ?? null
  if (!ctx || reducedMotion()) return
  PALETTE.forEach((c, i) => (sprites[i] = makeSprite(c)))
  resize()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('click', onClick, true)
  document.addEventListener('visibilitychange', onVis)
  bus.addEventListener('burst', onBurst)
  start()
})
onBeforeUnmount(() => {
  stop()
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('click', onClick, true)
  document.removeEventListener('visibilitychange', onVis)
  bus.removeEventListener('burst', onBurst)
})
</script>

<template>
  <canvas ref="canvas" class="starfield" aria-hidden="true"></canvas>
  <div v-if="stars > 0" class="stars-hud" :class="{ pulse, done: stars >= TOTAL_STARS }">
    <button
      v-if="stars >= TOTAL_STARS"
      type="button"
      class="hud-chip"
      :aria-pressed="rainbow"
      @click="toggleRainbow"
    >
      <span aria-hidden="true">★</span> {{ t('stars_hud') }} {{ stars }}/{{ TOTAL_STARS }}
    </button>
    <span v-else class="hud-chip"
      ><span aria-hidden="true">★</span> {{ t('stars_hud') }} {{ stars }}/{{ TOTAL_STARS }}</span
    >
  </div>
  <p class="stars-toast" :class="{ on: toast }" role="status" aria-live="polite">{{ toast }}</p>
</template>

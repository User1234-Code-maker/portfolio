<script setup lang="ts">
import { computed } from 'vue'

// Волна трека: столбики строятся из названия (одинаково при каждом заходе).
// Закрашенная часть — это второй слой, обрезанный по прогрессу; во время игры столбики «дышат».
const props = defineProps<{ seed: string; progress: number; playing: boolean; label: string }>()
const emit = defineEmits<{ seek: [value: number] }>()

const bars = computed(() => {
  let h = [...props.seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  const rnd = () => {
    h = (h + 0x6d2b79f5) >>> 0
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return Array.from({ length: 72 }, (_, i) => ({
    h: 0.18 + Math.abs(Math.sin(i / 5.5)) * 0.32 + rnd() * 0.5,
    d: `${((i * 53) % 700) / 1000}s`,
  }))
})

function pointer(e: PointerEvent) {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  emit('seek', (e.clientX - r.left) / r.width)
}
function key(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') emit('seek', props.progress + 0.05)
  else if (e.key === 'ArrowLeft') emit('seek', props.progress - 0.05)
  else return
  e.preventDefault()
}
</script>

<template>
  <div
    class="wavebars"
    :class="{ playing }"
    role="slider"
    tabindex="0"
    :aria-label="label"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="Math.round(progress * 100)"
    :style="{ '--p': `${progress * 100}%` }"
    @pointerdown="pointer"
    @keydown="key"
  >
    <span class="wb base"><i v-for="(b, i) in bars" :key="i" :style="{ '--bh': b.h, '--d': b.d }"></i></span>
    <span class="wb fill" aria-hidden="true"
      ><i v-for="(b, i) in bars" :key="i" :style="{ '--bh': b.h, '--d': b.d }"></i
    ></span>
  </div>
</template>

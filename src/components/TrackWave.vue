<script setup lang="ts">
import { computed } from 'vue'

// Декоративная «волна» трека: высоты столбиков псевдослучайные, но одинаковые при каждом показе.
// progress (0–1) закрашивает пройденную часть; при playing столбики мягко «дышат» (только transform).
const props = withDefaults(
  defineProps<{ bars?: number; playing?: boolean; progress?: number; seed?: number }>(),
  {
    bars: 64,
    playing: false,
    progress: 0,
    seed: 7,
  },
)
const heights = computed(() => {
  let x = props.seed * 9301 + 49297
  return Array.from({ length: props.bars }, (_, i) => {
    x = (x * 9301 + 49297) % 233280
    const r = x / 233280
    const env = 0.45 + 0.55 * Math.sin((i / props.bars) * Math.PI) // громче в середине
    return Math.round((0.18 + 0.82 * r * env) * 100)
  })
})
</script>

<template>
  <span class="wave" :class="{ playing }" aria-hidden="true">
    <i
      v-for="(h, i) in heights"
      :key="i"
      :class="{ done: i / bars < progress }"
      :style="{ '--h': h / 100, '--d': `${(i % 9) * -0.13}s` }"
    ></i>
  </span>
</template>

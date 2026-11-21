<script setup lang="ts">
import { computed } from 'vue'

// Небольшой набор собственных иконок. f — залитые, s — линейные (stroke 2, скругления).
const icons = {
  play: ['f', 'M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z'],
  pause: ['f', 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z'],
  next: [
    'f',
    'M6 5.6v12.8a.8.8 0 0 0 1.2.7l8.6-6.4a.8.8 0 0 0 0-1.3L7.2 4.9A.8.8 0 0 0 6 5.6zM17 5h2.2v14H17z',
  ],
  prev: [
    'f',
    'M18 5.6v12.8a.8.8 0 0 1-1.2.7l-8.6-6.4a.8.8 0 0 1 0-1.3l8.6-6.5a.8.8 0 0 1 1.2.7zM4.8 5H7v14H4.8z',
  ],
  close: ['s', 'M6.5 6.5l11 11m0-11-11 11'],
  code: ['s', 'm8.5 7-5 5 5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15'],
  note: [
    's',
    'M9 18.2V5.5l11-2v12.4M9 18.2a3 3 0 1 1-3-3 3 3 0 0 1 3 3Zm11-2.3a3 3 0 1 1-3-3 3 3 0 0 1 3 3ZM9 9.5l11-2',
  ],
  arrow: ['s', 'M4.5 12h15m-6-6 6 6-6 6'],
  back: ['s', 'M19.5 12h-15m6-6-6 6 6 6'],
  ext: ['s', 'M8 16 17 7m-8 0h8v8'],
  download: ['s', 'M12 4v11m-5-5 5 5 5-5M5 19.5h14'],
  copy: ['s', 'M9 9h10v10H9zM15 9V5H5v10h4'],
  check: ['s', 'm5 12.5 4.5 4.5L19 7.5'],
  mail: ['s', 'M3.5 6.5h17v11h-17zM4 7l8 6 8-6'],
  layers: ['s', 'm12 4 8.5 4.5L12 13 3.5 8.5Zm-8.5 8L12 17l8.5-4.5M3.5 16 12 20.5l8.5-4.5'],
  spark: ['f', 'M12 1.5 14.4 9.6 22.5 12l-8.1 2.4L12 22.5l-2.4-8.1L1.5 12l8.1-2.4Z'],
  grid: ['s', 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
  user: ['s', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7.5 8.5c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5'],
  pin: [
    's',
    'M12 21s-6.5-6-6.5-11a6.5 6.5 0 1 1 13 0c0 5-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  ],
} as const

const props = withDefaults(defineProps<{ name: keyof typeof icons; size?: number }>(), { size: 20 })
const icon = computed(() => icons[props.name])
</script>

<template>
  <svg
    class="ico"
    :class="icon[0] === 's' ? 'st' : 'fl'"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="icon[1]" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Release } from '../data/types'
import { artistName } from '../data/music'

// Обложка-заглушка: рисуется кодом по оттенку релиза, чтобы не подсовывать чужие картинки.
const props = defineProps<{ release: Release; disc?: boolean; small?: boolean }>()
const seed = computed(() => [...props.release.id].reduce((a, c) => a + c.charCodeAt(0), 0))
const skyline = computed(() =>
  Array.from({ length: 9 }, (_, i) => ({ x: i * 22 - 2, h: 22 + ((seed.value * (i + 3)) % 58) })),
)
const sunX = computed(() => 40 + (seed.value % 90))
</script>

<template>
  <span class="rcover" :style="{ '--h': release.hue }">
    <span v-if="disc" class="rc-disc" aria-hidden="true"></span>
    <span v-if="release.cover" class="rc-art rc-real">
      <img
        :src="small ? (release.coverSm ?? release.cover) : release.cover"
        :alt="`${release.title}: ${artistName}`"
        :width="small ? 420 : 900"
        :height="small ? 420 : 900"
        loading="lazy"
        decoding="async"
      />
    </span>
    <span v-else class="rc-art">
      <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <circle :cx="sunX" cy="62" r="22" fill="#fff" opacity=".85" />
        <rect x="-6" y="82" width="120" height="14" rx="7" fill="#fff" opacity=".55" />
        <rect x="70" y="102" width="110" height="12" rx="6" fill="#fff" opacity=".4" />
        <rect
          v-for="b in skyline"
          :key="b.x"
          :x="b.x"
          :y="200 - b.h"
          width="18"
          :height="b.h"
          fill="#1E2A6B"
          opacity=".78"
        />
        <path d="M168 28l3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="#fff" />
      </svg>
      <span class="rc-head">
        <span class="rc-title">{{ release.title }}</span>
        <span class="rc-artist">{{ artistName }}</span>
      </span>
    </span>
  </span>
</template>

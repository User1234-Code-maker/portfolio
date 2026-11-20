<script setup lang="ts">
import { socials } from '../data/socials'
import { hrefFor, isExternal } from '../utils/links'

defineProps<{ big?: boolean; round?: boolean }>()
</script>

<template>
  <span class="soc" :class="{ big, round }">
    <a
      v-for="s in socials"
      :key="s.key"
      :href="hrefFor(s.key)"
      :aria-label="s.label"
      :target="isExternal(s.key) ? '_blank' : undefined"
      :rel="isExternal(s.key) ? 'noopener' : undefined"
    >
      <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path :d="s.path" />
      </svg>
    </a>
  </span>
</template>

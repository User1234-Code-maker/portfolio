<script setup lang="ts">
import AppFooter from './AppFooter.vue'
import SceneHero from './SceneHero.vue'
import WorldBackdrop from './WorldBackdrop.vue'
import type { CityMood } from '../composables/useCity'

// Каркас внутренней страницы: сцена с шапкой → содержимое → футер.
// Сцена получает свой текст (#hero), иллюстрацию справа (#art) и декор поверх неба (#decor).
defineProps<{ name: string; jp?: string; mood?: CityMood }>()
</script>

<template>
  <div class="page" :class="`pg-${name}`">
    <WorldBackdrop />
    <SceneHero :variant="name" :jp="jp" :mood="mood">
      <slot name="hero" />
      <template v-if="$slots.art" #art><slot name="art" /></template>
      <template v-if="$slots.decor" #decor><slot name="decor" /></template>
    </SceneHero>
    <main id="main" class="page-main"><slot /></main>
    <AppFooter />
  </div>
</template>

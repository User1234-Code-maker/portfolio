<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import PageVeil from './components/PageVeil.vue'
import PixelCat from './components/PixelCat.vue'
import { pageReady } from './utils/pageScroll'

const route = useRoute()
const veilKey = ref(0)

// ключ страницы: /projects/a и /projects/b — разные страницы, а смена языка страницу не пересоздаёт
const pageKey = () => route.path
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in" @leave="veilKey++" @enter="pageReady" @after-enter="pageReady">
      <component :is="Component" :key="pageKey()" />
    </Transition>
  </RouterView>
  <PageVeil :trigger="veilKey" />
  <PixelCat />
</template>

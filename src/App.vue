<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useLang } from './composables/useLang'
import { projectBySlug } from './data/projects'
import PageVeil from './components/PageVeil.vue'
import PixelCat from './components/PixelCat.vue'
import { pageReady } from './utils/pageScroll'

const route = useRoute()
const veilKey = ref(0)
const { t } = useLang()

// заголовок вкладки и описание зависят от страницы и языка
watchEffect(() => {
  const name = String(route.name)
  const navKey: Record<string, string> = {
    projects: 'nav_projects',
    music: 'nav_music',
    about: 'nav_about',
    contact: 'nav_contact',
  }
  const project = name === 'project' ? projectBySlug(String(route.params.slug)) : undefined
  const part = project ? project.title : navKey[name] ? t(navKey[name]) : name === 'not-found' ? '404' : ''
  document.title = part ? `${part} — Bogdan Korzun` : t('meta_title')
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta_desc'))
})

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

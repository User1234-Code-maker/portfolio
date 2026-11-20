<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useParallax } from '../composables/useParallax'
import AppHeader from './AppHeader.vue'
import HeroContent from './HeroContent.vue'
import HeroScene from './HeroScene.vue'

const root = ref<HTMLElement | null>(null)
useParallax(root)

// затухание низа Hero появляется только при прокрутке: --hf от 0 (экран открыт, как нарисовано) до 1
let ticking = false
const setFade = () => {
  ticking = false
  // на телефонах затухание включено сразу, на широких экранах растёт при прокрутке
  const k = matchMedia('(max-width:700px)').matches
    ? 1
    : Math.min(1, Math.max(0, scrollY / (innerHeight * 0.3)))
  root.value?.style.setProperty('--hf', k.toFixed(3))
}
const onScroll = () => {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(setFade)
  }
}
onMounted(() => {
  setFade()
  addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => removeEventListener('scroll', onScroll))
</script>

<template>
  <section ref="root" class="hero">
    <HeroScene />
    <div class="wrap">
      <AppHeader />
      <HeroContent />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { reducedMotion } from '../utils/pageScroll'
// «Единый мир»: тот же фон, что под Hero на главной. Сетка, световые пятна, далёкие облака
// и еле заметный силуэт города. Один компонент на все страницы, чтобы они читались как одно место.
import cloudA from '../assets/img/cloud-a-sm.webp'
import cloudB from '../assets/img/cloud-b-sm.webp'
import cityUrl from '../assets/img/city-sm.webp'
import sparkUrl from '../assets/img/spark.webp'

// единая переменная прокрутки --sy для лёгкого параллакса облаков (только translate, без перерисовки)
const root = ref<HTMLElement | null>(null)
let raf = 0
const onScroll = () => {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    root.value?.style.setProperty('--sy', String(Math.round(window.scrollY)))
  })
}
onMounted(() => {
  // на сенсорных экранах облака не двигаем: лишняя работа на каждом кадре скролла
  if (!reducedMotion() && !matchMedia('(hover: none)').matches)
    window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="root" class="world" aria-hidden="true">
    <div class="rest-grid"></div>
    <div class="orb o1"></div>
    <div class="orb o2"></div>
    <div class="orb o3"></div>
    <img class="w-cloud wc1" :src="cloudA" alt="" width="749" height="378" loading="lazy" decoding="async" />
    <img class="w-cloud wc2" :src="cloudB" alt="" width="770" height="273" loading="lazy" decoding="async" />
    <img class="w-city" :src="cityUrl" alt="" loading="lazy" decoding="async" />
    <img class="w-star ws1" :src="sparkUrl" alt="" width="368" height="368" loading="lazy" decoding="async" />
    <img class="w-star ws2" :src="sparkUrl" alt="" width="368" height="368" loading="lazy" decoding="async" />
  </div>
</template>

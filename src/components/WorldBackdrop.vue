<script setup lang="ts">
// «Единый мир»: тот же фон, что под Hero на главной: небо, облака, дома.
// Всё статично (никаких постоянных анимаций), поэтому прокрутка и переходы не тормозят.
import cloudA from '../assets/img/cloud-a-sm.webp'
import cloudB from '../assets/img/cloud-b-sm.webp'
import cloudC from '../assets/img/cloud-c-sm.webp'
import cityUrl from '../assets/img/city-sm.webp'
</script>

<template>
  <div class="world" aria-hidden="true">
    <div class="w-sky"></div>
    <div class="rest-grid"></div>
    <i class="w-sun"></i>
    <img class="w-cloud wc1" :src="cloudA" alt="" width="749" height="378" loading="lazy" decoding="async" />
    <img class="w-cloud wc2" :src="cloudB" alt="" width="770" height="273" loading="lazy" decoding="async" />
    <img class="w-cloud wc3" :src="cloudC" alt="" width="588" height="259" loading="lazy" decoding="async" />
    <img class="w-city" :src="cityUrl" alt="" width="1400" height="769" loading="lazy" decoding="async" />
  </div>
</template>

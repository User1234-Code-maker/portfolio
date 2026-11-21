<script setup lang="ts">
import type { Project } from '../data/types'

// Образ проекта. Есть обложка — показываем её; нет (NDA) — рисуем абстрактную иллюстрацию
// по типу проекта: окно с таблицами для ERP, чат и плитки mini app для ботов.
// Никаких выдуманных данных: только формы, без текста.
withDefaults(defineProps<{ project: Project; eager?: boolean; sizes?: string }>(), {
  eager: false,
  sizes: '(max-width: 700px) 100vw, 60vw',
})
</script>

<template>
  <div class="pv" :class="`pv-${project.category}`" :style="{ '--h': project.hue }">
    <img
      v-if="project.cover"
      class="pv-img"
      :src="project.cover"
      alt=""
      width="1600"
      height="760"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async"
    />
    <div v-else-if="project.category === 'erp'" class="pv-art pv-erp" aria-hidden="true">
      <div class="erp-win">
        <div class="erp-bar"><i></i><i></i><i></i></div>
        <div class="erp-side"><b></b><b></b><b class="on"></b><b></b><b></b></div>
        <div class="erp-main">
          <div class="erp-tools"><b></b><b></b><b class="acc"></b></div>
          <div class="erp-head"><b></b><b></b><b></b><b></b></div>
          <div v-for="n in 6" :key="n" class="erp-row" :class="{ sel: n === 3 }">
            <b></b><b></b><b></b><b></b>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="pv-art pv-bots" aria-hidden="true">
      <div class="bot-phone">
        <div class="bot-top"><i></i><b></b></div>
        <div class="bot-msg in"></div>
        <div class="bot-msg out"></div>
        <div class="bot-msg in short"></div>
        <div class="bot-keys"><b></b><b></b><b></b><b></b></div>
      </div>
      <div class="bot-app"><b></b><b></b><b></b><b></b></div>
    </div>
  </div>
</template>

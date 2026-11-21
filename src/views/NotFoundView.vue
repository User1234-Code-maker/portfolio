<script setup lang="ts">
import PageShell from '../components/PageShell.vue'
import UiIcon from '../components/UiIcon.vue'
import { useLang } from '../composables/useLang'
import cat from '../assets/img/cat.png'

const { t } = useLang()
</script>

<template>
  <PageShell name="nf" jp="迷子">
    <template #hero>
      <p class="nf-num" aria-hidden="true"><span>4</span><span class="nf-0">0</span><span>4</span></p>
      <h1 class="sc-title nf-title">{{ t('nf_title') }}</h1>
      <p class="sc-lead">{{ t('nf_text') }}</p>
      <div class="sc-actions">
        <RouterLink class="pill" to="/"><UiIcon name="back" :size="18" /> {{ t('nf_home') }}</RouterLink>
        <RouterLink class="ghost-btn" to="/projects"
          >{{ t('p_title') }} <UiIcon name="arrow" :size="18"
        /></RouterLink>
      </div>
    </template>
    <template #art>
      <!-- островок, унесённый ветром, на нём котик -->
      <div class="nf-scene" aria-hidden="true">
        <div class="nf-island">
          <svg class="nf-rock" viewBox="0 0 400 220">
            <path
              d="M18 42c62-20 302-20 364 0-4 26-30 44-58 62-14 30-40 40-58 70-12 22-26 38-42 40-18-4-26-26-40-44-20-24-48-30-70-56-30-14-80-34-96-72Z"
            />
            <path
              class="shade"
              d="M70 92c40 18 80 22 120 60 18 16 26 40 40 58-16-4-26-26-40-44-20-24-48-30-70-56Zm250 8c-16 26-36 34-52 56 10-24 30-38 52-56Z"
            />
            <path class="root" d="M152 150c-4 18 2 30-6 44M256 140c6 14 0 26 8 38M200 210c0 8-2 14 2 20" />
            <path
              class="grass"
              d="M12 42c64-26 312-26 376 0-6 14-24 8-40 12-40-8-80 4-120-2-40 6-80-6-120 2-36-4-60 8-96-12Z"
            />
          </svg>
          <img class="nf-cat" :src="cat" alt="" width="342" height="294" />
          <span class="nf-sign">?</span>
        </div>
      </div>
    </template>
  </PageShell>
</template>

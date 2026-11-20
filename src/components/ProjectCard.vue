<script setup lang="ts">
import { computed } from 'vue'
import { useLang } from '../composables/useLang'
import { vTilt } from '../directives/tilt'
import type { Project } from '../data/types'
import LazyImg from './LazyImg.vue'

const props = defineProps<{ project: Project; index?: number; priority?: boolean }>()
const { lang, t } = useLang()
const p = computed(() => props.project)
</script>

<template>
  <article
    v-tilt
    class="card pcard tilt"
    :class="{ stub: p.sample }"
    :style="{ '--i': index ?? 0, '--h': p.hue }"
  >
    <RouterLink class="cover-link" :to="`/projects/${p.slug}`" aria-hidden="true" tabindex="-1">
      <div class="thumb" :class="{ ph: !p.cover }">
        <LazyImg v-if="p.cover" :src="p.cover" :width="1160" :height="308" :eager="priority && index === 0" />
        <template v-else>
          <span class="ph-art" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="ph-title" aria-hidden="true">{{ p.title }}</span>
        </template>
        <span class="cat-tag">{{ t(`cat_${p.category}`) }}</span>
        <span v-if="p.sample" class="badge">{{ t('p_sample') }}</span>
        <span v-else-if="p.nda" class="badge nda">{{ t('p_nda') }}</span>
      </div>
    </RouterLink>
    <div class="body">
      <h3>
        <RouterLink :to="`/projects/${p.slug}`">{{ p.title }}</RouterLink>
      </h3>
      <p>{{ p[lang] }}</p>
      <div class="chips">
        <span v-for="tech in p.tech" :key="tech">{{ tech }}</span>
      </div>
      <div v-if="p.nda" class="links">
        <span class="off nda-line">{{ t('p_nda_links') }}</span>
      </div>
      <div v-else class="links">
        <a v-if="p.demo" class="solid" :href="p.demo" target="_blank" rel="noopener">{{ t('p_demo_btn') }}</a>
        <span v-else class="off" aria-disabled="true">{{ t('p_demo_btn') }} · {{ t('p_nolink') }}</span>
        <a v-if="p.repo" :href="p.repo" target="_blank" rel="noopener">{{ t('p_code_btn') }}</a>
        <span v-else class="off" aria-disabled="true">{{ t('p_code_btn') }} · {{ t('p_nolink') }}</span>
      </div>
    </div>
  </article>
</template>

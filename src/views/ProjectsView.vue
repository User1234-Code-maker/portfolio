<script setup lang="ts">
import { computed, ref } from 'vue'
import PageShell from '../components/PageShell.vue'
import ProjectVisual from '../components/ProjectVisual.vue'
import SceneEyebrow from '../components/SceneEyebrow.vue'
import UiIcon from '../components/UiIcon.vue'
import { useLang } from '../composables/useLang'
import { categories, projects } from '../data/projects'
import type { Category } from '../data/types'
import { tx } from '../utils/i18n'

const { lang, t } = useLang()
const active = ref<Category | 'all'>('all')
const shown = computed(() =>
  active.value === 'all' ? projects : projects.filter((p) => p.category === active.value),
)
// «4 проекта», «5 проектов», «1 проект»
const countWord = computed(() => {
  const n = projects.length % 100
  const d = n % 10
  if (lang.value === 'ru' && d === 1 && n !== 11) return t('p_count_one')
  if (lang.value === 'ru' && d >= 2 && d <= 4 && (n < 12 || n > 14)) return t('p_count_few')
  return t(lang.value === 'ru' ? 'p_count_many' : 'p_count_few')
})
const count = (c: Category | 'all') =>
  c === 'all' ? projects.length : projects.filter((p) => p.category === c).length
</script>

<template>
  <PageShell name="projects" jp="作品">
    <template #hero>
      <SceneEyebrow :text="t('eyebrow')" />
      <h1 class="sc-title">{{ t('p_title') }}</h1>
      <p class="sc-lead">{{ t('p_sub_page') }}</p>
      <p class="pr-count">
        <b>{{ projects.length }}</b> {{ countWord }}
      </p>
    </template>
    <template #art>
      <!-- веер из обложек: при наведении карточки расходятся -->
      <div class="pr-fan" aria-hidden="true">
        <div v-for="(p, i) in projects" :key="p.slug" class="pr-fan-card" :style="{ '--i': i }">
          <ProjectVisual :project="p" :eager="i === 0" />
        </div>
      </div>
    </template>

    <section class="wrap blk-first" aria-labelledby="gal-t">
      <h2 id="gal-t" class="sr-only">{{ t('p_title') }}</h2>
      <div class="filters" role="group" :aria-label="t('f_label')">
        <button
          v-for="c in ['all', ...categories] as const"
          :key="c"
          type="button"
          class="fchip"
          :class="{ on: active === c }"
          :aria-pressed="active === c"
          @click="active = c"
        >
          {{ t(`cat_${c}`) }}<small>{{ count(c) }}</small>
        </button>
      </div>

      <TransitionGroup tag="div" name="gal" class="gallery" aria-live="polite">
        <article
          v-for="(p, i) in shown"
          :key="p.slug"
          class="gal-card"
          :class="[`span-${i % 4}`, { solo: shown.length === 1 }]"
          :style="{ '--h': p.hue }"
        >
          <div class="gal-media">
            <ProjectVisual :project="p" :eager="i === 0" />
            <span class="gal-open" aria-hidden="true"
              >{{ t('p_open_case') }} <UiIcon name="arrow" :size="16"
            /></span>
            <span v-if="p.nda" class="gal-badge">{{ t('p_nda') }}</span>
          </div>
          <div class="gal-body">
            <p class="gal-meta">
              <span>{{ t(`cat_${p.category}`) }}</span><span>{{ p.year }}</span>
            </p>
            <h3>
              <RouterLink class="gal-link" :to="`/projects/${p.slug}`">{{ tx(p.title, lang) }}</RouterLink>
            </h3>
            <p class="gal-desc">{{ p[lang] }}</p>
            <ul class="chip-row">
              <li v-for="tech in p.tech" :key="tech">{{ tech }}</li>
            </ul>
            <div v-if="!p.nda && (p.demo || p.repo)" class="gal-links">
              <a v-if="p.demo" :href="p.demo" target="_blank" rel="noopener"
                >{{ t('p_demo_btn') }} <UiIcon name="ext" :size="15"
              /></a>
              <a v-if="p.repo" :href="p.repo" target="_blank" rel="noopener"
                >{{ t('p_code_btn') }} <UiIcon name="ext" :size="15"
              /></a>
            </div>
            <p v-else-if="p.nda" class="gal-nda">{{ t('p_nda_links') }}</p>
          </div>
        </article>
      </TransitionGroup>
      <p v-if="!shown.length" class="empty">{{ t('p_empty') }}</p>
    </section>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHead from '../components/PageHead.vue'
import PageShell from '../components/PageShell.vue'
import ProjectCard from '../components/ProjectCard.vue'
import { useLang } from '../composables/useLang'
import { categories, projects } from '../data/projects'
import type { Category } from '../data/types'

const { t } = useLang()
const active = ref<Category | 'all'>('all')
const shown = computed(() =>
  active.value === 'all' ? projects : projects.filter((p) => p.category === active.value),
)
const count = (c: Category | 'all') =>
  c === 'all' ? projects.length : projects.filter((p) => p.category === c).length
</script>

<template>
  <PageShell>
    <PageHead :title="t('p_title')" :lead="t('p_sub_page')" jp="作品" />
    <section class="wrap sec-tight">
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
      <h2 class="sr-only">{{ t('p_title') }}</h2>
      <Transition name="grid" mode="out-in">
        <div :key="active" class="cards big" aria-live="polite">
          <ProjectCard v-for="(p, i) in shown" :key="p.slug" :project="p" :index="i" priority />
          <p v-if="!shown.length" class="empty">{{ t('p_empty') }}</p>
        </div>
      </Transition>
    </section>
  </PageShell>
</template>

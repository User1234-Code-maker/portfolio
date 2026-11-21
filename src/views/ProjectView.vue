<script setup lang="ts">
import { computed } from 'vue'
import LazyImg from '../components/LazyImg.vue'
import PageShell from '../components/PageShell.vue'
import ProjectVisual from '../components/ProjectVisual.vue'
import UiIcon from '../components/UiIcon.vue'
import { useLang } from '../composables/useLang'
import { tx } from '../utils/i18n'
import { vReveal } from '../directives/reveal'
import { projectBySlug, projects } from '../data/projects'
import NotFoundView from './NotFoundView.vue'

const props = defineProps<{ slug: string }>()
const { lang, t } = useLang()

const project = computed(() => projectBySlug(props.slug))
const idx = computed(() => projects.findIndex((p) => p.slug === props.slug))
const next = computed(() => projects[(idx.value + 1) % projects.length]!)

// Своя подача у каждого проекта: рамка превью зависит от типа
// (браузер для сайтов, окно приложения для ERP, телефон для ботов), галерея — от проекта.
const frame = computed(() =>
  project.value?.category === 'bots' ? 'phone' : project.value?.category === 'erp' ? 'app' : 'browser',
)
const host = computed(() => {
  const d = project.value?.demo
  return d ? d.replace(/^https?:\/\//, '').replace(/\/$/, '') : ''
})
</script>

<template>
  <NotFoundView v-if="!project" />
  <PageShell v-else :name="`project pd-${project.slug}`" jp="作品">
    <template #hero>
      <RouterLink class="pd-back" to="/projects"
        ><UiIcon name="back" :size="16" /> {{ t('p_back') }}</RouterLink
      >
      <p class="pd-meta">
        <span>{{ t(`cat_${project.category}`) }}</span><span>{{ project.year }}</span
        ><span v-if="project.nda" class="pd-nda">{{ t('p_nda') }}</span>
      </p>
      <h1 class="sc-title pd-title">{{ tx(project.title, lang) }}</h1>
      <p class="sc-lead">{{ project[lang] }}</p>
      <ul class="chip-row pd-tags">
        <li v-for="tech in project.tech" :key="tech">{{ tech }}</li>
      </ul>
      <div v-if="!project.nda && (project.demo || project.repo)" class="sc-actions">
        <a v-if="project.demo" class="pill" :href="project.demo" target="_blank" rel="noopener"
          >{{ t('p_demo_btn') }} <UiIcon name="ext" :size="17"
        /></a>
        <a v-if="project.repo" class="ghost-btn" :href="project.repo" target="_blank" rel="noopener"
          >{{ t('p_code_btn') }} <UiIcon name="ext" :size="17"
        /></a>
      </div>
    </template>
    <template #art>
      <div class="pd-stage" :class="`fr-${frame}`" :style="{ '--h': project.hue }">
        <div class="pd-frame">
          <div v-if="frame === 'browser'" class="fr-bar" aria-hidden="true">
            <i></i><i></i><i></i><span>{{ host }}</span>
          </div>
          <ProjectVisual :project="project" eager />
        </div>
      </div>
    </template>

    <article :style="{ '--h': project.hue }">
      <!-- факты одной строкой -->
      <section class="wrap blk-first">
        <dl v-reveal class="pd-facts glass">
          <div>
            <dt>{{ t('p_role') }}</dt>
            <dd>{{ project.role[lang] }}</dd>
          </div>
          <div>
            <dt>{{ t('p_year') }}</dt>
            <dd>{{ project.year }}</dd>
          </div>
          <div>
            <dt>{{ t('p_cat') }}</dt>
            <dd>{{ t(`cat_${project.category}`) }}</dd>
          </div>
          <div>
            <dt>{{ t('p_stack') }}</dt>
            <dd>{{ project.tech.join(', ') }}</dd>
          </div>
        </dl>
      </section>

      <section class="wrap blk pd-about" aria-labelledby="about-t">
        <h2 id="about-t" v-reveal class="blk-kicker">{{ t('p_about') }}</h2>
        <div v-reveal class="pd-about-body">
          <p class="pd-long">{{ project.long[lang] }}</p>
          <p v-if="project.nda" class="pd-note glass">
            <UiIcon name="layers" :size="20" /><span>{{ t('p_nda_note') }}</span>
          </p>
        </div>
      </section>

      <!-- архитектура: путь данных слева направо, по линии бежит «импульс» -->
      <section v-reveal class="wrap blk" aria-labelledby="arch-t">
        <h2 id="arch-t" class="blk-h">{{ t('p_arch') }}</h2>
        <ol class="flow stagger">
          <li v-for="(n, i) in project.arch" :key="tx(n.label, 'en')" :style="{ '--i': i }">
            <span class="flow-n">{{ String(i + 1).padStart(2, '0') }}</span>
            <b>{{ tx(n.label, lang) }}</b>
            <small v-if="n.note">{{ n.note[lang] }}</small>
          </li>
        </ol>
        <p class="blk-hint">{{ t('p_arch_note') }}</p>
      </section>

      <section v-if="project.shots?.length" v-reveal class="wrap blk" aria-labelledby="shots-t">
        <h2 id="shots-t" class="blk-h">{{ t('p_shots') }}</h2>
        <div
          class="pd-shots stagger"
          :class="`shots-${project.slug}`"
          :tabindex="project.slug === 'portfolio-site' ? 0 : undefined"
          :role="project.slug === 'portfolio-site' ? 'region' : undefined"
          :aria-label="project.slug === 'portfolio-site' ? t('p_shots') : undefined"
        >
          <figure v-for="(s, i) in project.shots" :key="s" class="pd-shot" :style="{ '--i': i }">
            <LazyImg :src="s" :width="1200" :height="750" :alt="`${tx(project.title, lang)} · ${i + 1}`" />
          </figure>
        </div>
      </section>

      <!-- следующий проект: большая карточка с его образом -->
      <nav class="wrap blk" :aria-label="t('p_next')">
        <RouterLink class="pd-next glass" :to="`/projects/${next.slug}`" :style="{ '--h': next.hue }">
          <span class="pd-next-text">
            <small>{{ t('p_next') }}</small>
            <b>{{ tx(next.title, lang) }}</b>
            <span class="pd-next-go">{{ t('p_open_case') }} <UiIcon name="arrow" :size="18" /></span>
          </span>
          <span class="pd-next-media"><ProjectVisual :project="next" /></span>
        </RouterLink>
      </nav>
    </article>
  </PageShell>
</template>

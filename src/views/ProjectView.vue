<script setup lang="ts">
import { computed } from 'vue'
import LazyImg from '../components/LazyImg.vue'
import PageShell from '../components/PageShell.vue'
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
</script>

<template>
  <NotFoundView v-if="!project" />
  <PageShell v-else>
    <article>
      <header class="wrap pj-head" :style="{ '--h': project.hue }">
        <RouterLink class="back" to="/projects"
          ><span aria-hidden="true">←</span> {{ t('p_back') }}</RouterLink
        >
        <div class="pj-title">
          <span class="cat-tag static">{{ t(`cat_${project.category}`) }}</span>
          <h1>{{ tx(project.title, lang) }}</h1>
          <p class="lead">{{ project[lang] }}</p>
        </div>
        <div class="pj-cover" :class="{ ph: !project.cover }">
          <LazyImg v-if="project.cover" :src="project.cover" :width="1160" :height="308" eager />
          <template v-else>
            <span class="ph-art" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="ph-title" aria-hidden="true">{{ tx(project.title, lang) }}</span>
          </template>
          <span v-if="project.sample" class="badge">{{ t('p_sample') }}</span>
          <span v-else-if="project.nda" class="badge nda">{{ t('p_nda') }}</span>
        </div>
      </header>

      <div class="wrap pj-grid">
        <section v-reveal class="pj-main">
          <p class="pj-long">{{ project.long[lang] }}</p>
          <p v-if="project.sample" class="note">{{ t('p_sample_note') }}</p>
          <p v-else-if="project.nda" class="note">{{ t('p_nda_note') }}</p>
          <div v-if="!project.nda" class="links big-links">
            <a v-if="project.demo" class="solid" :href="project.demo" target="_blank" rel="noopener">{{
              t('p_demo_btn')
            }}</a>
            <span v-else class="off" aria-disabled="true">{{ t('p_demo_btn') }} · {{ t('p_nolink') }}</span>
            <a v-if="project.repo" :href="project.repo" target="_blank" rel="noopener">{{
              t('p_code_btn')
            }}</a>
            <span v-else class="off" aria-disabled="true">{{ t('p_code_btn') }} · {{ t('p_nolink') }}</span>
          </div>
        </section>
        <aside v-reveal class="pj-meta">
          <dl>
            <dt>{{ t('p_role') }}</dt>
            <dd>{{ project.role[lang] }}</dd>
            <dt>{{ t('m_date') }}</dt>
            <dd>{{ project.year }}</dd>
            <dt>{{ t('p_stack') }}</dt>
            <dd>
              <span class="chips"
                ><span v-for="tech in project.tech" :key="tech">{{ tech }}</span></span
              >
            </dd>
          </dl>
        </aside>
      </div>

      <section v-reveal class="wrap pj-sec" aria-labelledby="arch-t">
        <h2 id="arch-t">{{ t('p_arch') }}</h2>
        <ol class="arch stagger">
          <li v-for="(n, i) in project.arch" :key="tx(n.label, 'en')" :style="{ '--i': i }">
            <b>{{ tx(n.label, lang) }}</b>
            <small v-if="n.note">{{ n.note[lang] }}</small>
          </li>
        </ol>
        <p class="arch-note">{{ t('p_arch_note') }}</p>
      </section>

      <section v-if="!project.nda" v-reveal class="wrap pj-sec" aria-labelledby="shots-t">
        <h2 id="shots-t">{{ t('p_shots') }}</h2>
        <div v-if="project.shots?.length" class="shots stagger">
          <figure v-for="(s, i) in project.shots" :key="s" class="shot real" :style="{ '--i': i }">
            <LazyImg :src="s" :width="1200" :height="750" :alt="`${tx(project.title, lang)} · ${i + 1}`" />
          </figure>
        </div>
        <div v-else class="shots stagger">
          <figure v-for="n in 3" :key="n" class="shot" :style="{ '--i': n, '--h': project.hue + n * 14 }">
            <span class="shot-bar" aria-hidden="true"><i></i><i></i><i></i></span>
            <figcaption>{{ t('p_shot_soon') }}</figcaption>
          </figure>
        </div>
      </section>

      <nav class="wrap pj-next" :aria-label="t('p_next')">
        <RouterLink :to="`/projects/${next.slug}`">
          <small>{{ t('p_next') }}</small>
          <b>{{ tx(next.title, lang) }} <span aria-hidden="true">→</span></b>
        </RouterLink>
      </nav>
    </article>
  </PageShell>
</template>

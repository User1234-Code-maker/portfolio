<script setup lang="ts">
import { site } from '../data/site'
import { useLang } from '../composables/useLang'
import { vReveal } from '../directives/reveal'
import { vTilt } from '../directives/tilt'

const { lang, t } = useLang()
</script>

<template>
  <section v-reveal class="sec wrap" aria-labelledby="projects-title">
    <header class="sec-h">
      <h2 id="projects-title">{{ t('p_title') }}</h2>
      <p>{{ t('p_sub') }}</p>
    </header>
    <div class="cards stagger">
      <article
        v-for="(p, i) in site.projects"
        :key="p.title"
        v-tilt
        class="card tilt"
        :class="{ stub: p.soon }"
        :style="{ '--i': i }"
      >
        <div
          class="thumb"
          :class="{ ph: !p.cover }"
          :style="p.hue !== undefined ? { '--h': p.hue } : undefined"
        >
          <img
            v-if="p.cover"
            :src="p.cover"
            alt=""
            loading="lazy"
            decoding="async"
            width="1160"
            height="308"
          />
          <span v-else class="ph-mark" aria-hidden="true">✦</span>
          <span v-if="p.soon" class="badge">{{ t('p_badge') }}</span>
        </div>
        <div class="body">
          <h3>{{ p.title }}</h3>
          <p>{{ p[lang] }}</p>
          <div class="chips">
            <span v-for="tech in p.tech" :key="tech">{{ tech }}</span>
          </div>
          <div v-if="p.demo || p.repo" class="links">
            <a v-if="p.demo" class="solid" :href="p.demo" target="_blank" rel="noopener">{{ t('p_demo') }}</a>
            <a v-if="p.repo" :href="p.repo" target="_blank" rel="noopener">{{ t('p_repo') }}</a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

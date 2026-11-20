<script setup lang="ts">
import { site } from '../data/site'
import { useLang } from '../composables/useLang'
import { vReveal } from '../directives/reveal'
import { vTilt } from '../directives/tilt'

const { lang, t } = useLang()
</script>

<template>
  <section v-reveal class="sec wrap" aria-labelledby="skills-title">
    <header class="sec-h">
      <h2 id="skills-title">{{ t('s_title') }}</h2>
      <p>{{ t('s_sub') }}</p>
    </header>
    <div class="skills stagger">
      <div v-for="(g, i) in site.skills" :key="g.name.en" v-tilt class="skill tilt" :style="{ '--i': i }">
        <h3>{{ g.name[lang] }}</h3>
        <ul>
          <li v-for="item in g.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

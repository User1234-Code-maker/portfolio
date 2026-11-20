<script setup lang="ts">
import { site } from '../data/site'
import { useLang } from '../composables/useLang'
import { vReveal } from '../directives/reveal'

const { lang, t } = useLang()
</script>

<template>
  <section v-reveal class="sec wrap" aria-labelledby="exp-title">
    <header class="sec-h">
      <h2 id="exp-title">{{ t('e_title') }}</h2>
      <p>{{ t('e_sub') }}</p>
    </header>
    <ol class="timeline stagger">
      <li v-for="(j, i) in site.jobs" :key="j.period" :style="{ '--i': i }">
        <span class="dot" aria-hidden="true"></span>
        <time class="period">{{ j.period }}</time>
        <h3>{{ j.role[lang] }}</h3>
        <p class="co">{{ j.company[lang] }}</p>
        <p>{{ j.text[lang] }}</p>
      </li>
    </ol>
  </section>
</template>

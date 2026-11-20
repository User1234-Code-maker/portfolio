<script setup lang="ts">
import { site } from '../data/site'
import { useLang } from '../composables/useLang'
import { vReveal } from '../directives/reveal'
import { vTilt } from '../directives/tilt'

const { lang, t } = useLang()
</script>

<template>
  <section v-reveal class="sec wrap" aria-labelledby="about-title">
    <header class="sec-h">
      <h2 id="about-title">{{ t('a_title') }}</h2>
    </header>
    <div class="about">
      <p>{{ t('a_text') }}</p>
      <span class="avail"
        ><i></i><span>{{ t('a_open') }}</span></span
      >
    </div>
    <h3 class="sub-h">{{ t('a_do') }}</h3>
    <div class="services stagger">
      <div
        v-for="(s, i) in site.services"
        :key="s.title.en"
        v-tilt
        class="service tilt"
        :style="{ '--i': i }"
      >
        <span class="sv-mark" aria-hidden="true">✦</span>
        <h4>{{ s.title[lang] }}</h4>
        <p>{{ s.text[lang] }}</p>
      </div>
    </div>
  </section>
</template>

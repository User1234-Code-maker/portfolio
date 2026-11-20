<script setup lang="ts">
import { site } from '../data/site'
import { useLang } from '../composables/useLang'
import { hrefFor } from '../utils/links'
import { vReveal } from '../directives/reveal'
import SocialLinks from './SocialLinks.vue'

const { t } = useLang()
</script>

<template>
  <section v-reveal class="sec wrap" aria-labelledby="contact-title">
    <header class="sec-h">
      <h2 id="contact-title">{{ t('c_title') }}</h2>
      <p>{{ t('c_sub') }}</p>
    </header>
    <div class="contact">
      <a class="pill big" :href="hrefFor('mail')">{{ t('c_mail') }} <span aria-hidden="true">→</span></a>
      <SocialLinks big />
    </div>
    <p class="mailtext">
      <a :href="hrefFor('mail')">{{ site.contacts.email }}</a>
    </p>
  </section>
</template>

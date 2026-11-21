<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import PageShell from '../components/PageShell.vue'
import SceneEyebrow from '../components/SceneEyebrow.vue'
import ToriiArt from '../components/ToriiArt.vue'
import UiIcon from '../components/UiIcon.vue'
import { useLang } from '../composables/useLang'
import { site } from '../data/site'
import { socials } from '../data/socials'
import { vReveal } from '../directives/reveal'
import { hrefFor } from '../utils/links'

const { t } = useLang()
const state = ref<'idle' | 'ok' | 'fail'>('idle')
let timer = 0

async function copy() {
  try {
    await navigator.clipboard.writeText(site.contacts.email)
    state.value = 'ok'
  } catch {
    state.value = 'fail'
  }
  window.clearTimeout(timer)
  timer = window.setTimeout(() => (state.value = 'idle'), 2200)
}
onBeforeUnmount(() => window.clearTimeout(timer))

const message = computed(() =>
  state.value === 'ok' ? t('c_copied') : state.value === 'fail' ? t('c_copy_fail') : '',
)
// номер телефона WhatsApp не выводим текстом, только ссылкой
// у каждой площадки свой фирменный оттенок для подсветки при наведении
const tint: Record<string, string> = {
  telegram: '#2AA3EF',
  github: '#8B7CF6',
  linkedin: '#0A84D0',
  whatsapp: '#25C26A',
  soundcloud: '#FF6A1A',
}
const handle = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
const channels = computed(() =>
  socials.map((s) => ({
    ...s,
    href: hrefFor(s.key),
    tint: tint[s.key],
    sub: s.key === 'whatsapp' ? t('c_open') : handle(hrefFor(s.key)),
  })),
)
</script>

<template>
  <PageShell name="contact" jp="連絡先" mood="dusk">
    <template #decor>
      <ToriiArt />
      <span class="ct-lantern l1"></span><span class="ct-lantern l2"></span
      ><span class="ct-lantern l3"></span>
    </template>
    <template #hero>
      <SceneEyebrow :text="t('c_title')" />
      <h1 class="sc-title">{{ t('c_big') }}</h1>
      <p class="sc-lead">{{ t('c_lead') }}</p>
      <!-- почта: главный способ связи — крупно, с копированием -->
      <div class="ct-mail glass">
        <span class="ct-mail-ic"><UiIcon name="mail" :size="22" /></span>
        <a class="ct-mail-addr" :href="hrefFor('mail')">{{ site.contacts.email }}</a>
        <button type="button" class="ct-copy" :class="state" @click="copy">
          <UiIcon :name="state === 'ok' ? 'check' : 'copy'" :size="18" />
          <span>{{ state === 'ok' ? t('c_copied') : t('c_copy') }}</span>
        </button>
      </div>
      <p class="sr-only" role="status" aria-live="polite">{{ message }}</p>
      <p v-if="state === 'fail'" class="ct-fail" role="alert">{{ t('c_copy_fail') }}</p>
      <div class="sc-actions">
        <a class="pill" :href="hrefFor('mail')">{{ t('c_mail') }} <UiIcon name="arrow" :size="18" /></a>
        <span class="avail"><i></i>{{ t('a_open') }}</span>
      </div>
    </template>

    <section class="wrap blk-first" aria-labelledby="ch-t">
      <h2 id="ch-t" class="blk-h">{{ t('c_channels') }}</h2>
      <ul v-reveal class="ct-grid stagger">
        <li
          v-for="(c, i) in channels"
          :key="c.key"
          :class="`ct-${c.key}`"
          :style="{ '--i': i, '--tint': c.tint }"
        >
          <a class="ct-card" :href="c.href" target="_blank" rel="noopener">
            <span class="ct-ic" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path :d="c.path" /></svg>
            </span>
            <span class="ct-txt">
              <b>{{ c.label }}</b>
              <small>{{ c.sub }}</small>
            </span>
            <span class="ct-go" aria-hidden="true"><UiIcon name="ext" :size="18" /></span>
          </a>
        </li>
      </ul>
    </section>
  </PageShell>
</template>

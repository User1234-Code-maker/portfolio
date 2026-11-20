<script setup lang="ts">
import { computed, ref } from 'vue'
import { soundcloudProfile } from '../data/music'
import { useLang } from '../composables/useLang'

// Плеер SoundCloud подгружается только после нажатия: так страница не тянет чужие скрипты заранее.
const { t } = useLang()
const on = ref(false)
const src = computed(
  () =>
    'https://w.soundcloud.com/player/?url=' +
    encodeURIComponent(soundcloudProfile) +
    '&color=%236B5BD6&auto_play=true&hide_related=true&show_comments=false&show_reposts=false&show_teaser=false&visual=false',
)
</script>

<template>
  <div class="sc-embed">
    <iframe
      v-if="on"
      :src="src"
      :title="t('m_embed_title')"
      width="100%"
      height="450"
      allow="autoplay"
      loading="lazy"
    ></iframe>
    <div v-else class="sc-facade">
      <button type="button" class="pill big" @click="on = true">
        <span aria-hidden="true">▶</span> {{ t('m_embed_btn') }}
      </button>
      <p>{{ t('m_embed_note') }}</p>
    </div>
  </div>
</template>

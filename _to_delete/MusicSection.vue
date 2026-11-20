<script setup lang="ts">
import { site } from '../data/site'
import { useLang } from '../composables/useLang'
import { hrefFor, isExternal } from '../utils/links'
import { vReveal } from '../directives/reveal'
import { vTilt } from '../directives/tilt'
import cover from '../assets/img/cover-music.webp'

const { t } = useLang()

// декоративная «волна» плеера
const bars = Array.from({ length: 48 }, (_, i) => {
  const h = Math.min(4 + Math.abs(Math.sin(i * 0.9)) * 16 + ((i * 37) % 7), 22)
  return { x: i * 5, y: (24 - h) / 2, h, played: i < 18 }
})
const sc = { href: hrefFor('soundcloud'), external: isExternal('soundcloud') }
const target = sc.external ? '_blank' : undefined
const rel = sc.external ? 'noopener' : undefined
</script>

<template>
  <section v-reveal class="sec wrap" aria-labelledby="music-title">
    <header class="sec-h">
      <h2 id="music-title">{{ t('m_title') }}</h2>
      <p>{{ t('m_sub') }}</p>
    </header>
    <div class="music-grid">
      <div v-tilt class="player tilt">
        <span class="disc-wrap" aria-hidden="true">
          <span class="disc"></span>
          <span class="cover"
            ><img :src="cover" alt="" width="1032" height="308" loading="lazy" decoding="async"
          /></span>
        </span>
        <span class="meta">
          <b>{{ t('m_name') }}</b>
          <i>{{ t('m_genre') }}</i>
          <svg class="wave" viewBox="0 0 240 24" aria-hidden="true">
            <rect
              v-for="b in bars"
              :key="b.x"
              :x="b.x"
              :y="b.y"
              width="3"
              :height="b.h"
              rx="1.5"
              :fill="b.played ? '#6B5BD6' : '#AEB6E8'"
            />
          </svg>
        </span>
        <a class="play" :href="sc.href" aria-label="SoundCloud" :target="target" :rel="rel"
          ><span aria-hidden="true">▶</span></a
        >
      </div>
      <ol class="tracks" :aria-label="t('m_tracks')">
        <li v-for="(tr, i) in site.tracks" :key="tr.title">
          <a :href="sc.href" :target="target" :rel="rel">
            <span class="n">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="tt">{{ tr.title }}</span>
            <span class="len">{{ tr.length }}</span>
            <span class="go" aria-hidden="true">▶</span>
            <span class="sr-only">{{ t('m_play') }}</span>
          </a>
        </li>
      </ol>
    </div>
    <a class="slink" :href="sc.href" :target="target" :rel="rel"
      ><span>{{ t('m_listen') }}</span> <span aria-hidden="true">→</span></a
    >
  </section>
</template>

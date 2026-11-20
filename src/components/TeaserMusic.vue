<script setup lang="ts">
import { artistName, releases } from '../data/music'
import { useLang } from '../composables/useLang'
import { vReveal } from '../directives/reveal'
import { vTilt } from '../directives/tilt'
import ReleaseCover from './ReleaseCover.vue'

const { t } = useLang()
const main = releases.find((r) => r.kind === 'album') ?? releases[0]!
const rest = releases.filter((r) => r.id !== main.id).slice(0, 3)
</script>

<template>
  <section v-reveal class="sec wrap" aria-labelledby="music-title">
    <header class="sec-h">
      <h2 id="music-title">{{ t('m_title') }}</h2>
      <p>{{ t('m_sub') }}</p>
    </header>
    <div class="tm-grid">
      <RouterLink v-tilt class="player tilt teaser-player" to="/music">
        <span class="tm-main-cover"><ReleaseCover :release="main" small /></span>
        <span class="meta">
          <b>{{ artistName }} · {{ main.title }}</b>
          <i>{{ t('m_genre') }}</i>
          <small
            >{{ t(`k_${main.kind}`) }} · {{ main.tracks.length }} {{ t('m_tracks').toLowerCase() }}</small
          >
        </span>
        <span class="play" aria-hidden="true">▶</span>
      </RouterLink>
      <ul class="tm-row stagger">
        <li v-for="(r, i) in rest" :key="r.id" :style="{ '--i': i }">
          <RouterLink class="tm-rel" to="/music">
            <ReleaseCover :release="r" small />
            <b>{{ r.title }}</b>
            <small>{{ t(`k_${r.kind}`) }}</small>
          </RouterLink>
        </li>
      </ul>
    </div>
    <RouterLink class="slink" to="/music"
      ><span>{{ t('m_all_releases') }}</span> <span aria-hidden="true">→</span></RouterLink
    >
  </section>
</template>

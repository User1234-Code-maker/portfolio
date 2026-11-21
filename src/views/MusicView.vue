<script setup lang="ts">
import { computed, ref } from 'vue'
import PageShell from '../components/PageShell.vue'
import ReleaseCover from '../components/ReleaseCover.vue'
import SceneEyebrow from '../components/SceneEyebrow.vue'
import TrackList from '../components/TrackList.vue'
import UiIcon from '../components/UiIcon.vue'
import TrackWave from '../components/TrackWave.vue'
import { seek, toggle, usePlayer } from '../composables/usePlayer'
import { useLang } from '../composables/useLang'
import { artistName, genreLabel, platforms, releases } from '../data/music'
import type { ReleaseKind } from '../data/types'
import { tx } from '../utils/i18n'
import { vReveal } from '../directives/reveal'
import { hrefFor } from '../utils/links'

const { lang, t } = useLang()

// выбранный релиз — в большой обложке и в плеере; по умолчанию альбом
const selectedId = ref(releases.find((r) => r.kind === 'album')?.id ?? releases[0]!.id)
const release = computed(() => releases.find((r) => r.id === selectedId.value) ?? releases[0]!)

const filter = ref<ReleaseKind | 'all'>('all')
const list = computed(() =>
  filter.value === 'all' ? releases : releases.filter((r) => r.kind === filter.value),
)
const kinds: (ReleaseKind | 'all')[] = ['all', 'album', 'single']
const kindLabel = (k: ReleaseKind | 'all') => t(k === 'all' ? 'm_f_all' : `m_f_${k}`)

// «2026» — только год, «2026-03-13» — месяц и год
const date = (iso: string) =>
  iso.length === 4
    ? iso
    : new Date(iso).toLocaleDateString(lang.value === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric',
        month: 'long',
      })

const player = usePlayer()
const isCur = computed(() => player.release?.id === release.value.id)
const relPlaying = computed(() => isCur.value && player.playing)
const progress = computed(() => (isCur.value && player.duration ? player.time / player.duration : 0))
const playRelease = () => toggle(release.value, isCur.value ? player.index : 0)
// клик по волне — перемотка внутри текущего трека
const onWave = (e: MouseEvent) => {
  if (!isCur.value || !player.duration) return
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  seek(((e.clientX - r.left) / r.width) * player.duration)
}
const pick = (id: string) => {
  selectedId.value = id
  document.getElementById('release-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const sc = hrefFor('soundcloud')
const seedOf = (id: string) => [...id].reduce((a, c) => a + c.charCodeAt(0), 0)
</script>

<template>
  <PageShell name="music" jp="音楽" mood="dusk">
    <template #hero>
      <SceneEyebrow :text="artistName" />
      <h1 class="sc-title">{{ t('m_title') }}</h1>
      <p class="sc-lead">{{ t('m_hero_tag') }}</p>
      <div class="sc-actions">
        <button type="button" class="pill" @click="playRelease">
          <UiIcon :name="relPlaying ? 'pause' : 'play'" :size="18" />
          {{ relPlaying ? t('np_pause') : release.tracks.length > 1 ? t('np_play_album') : t('np_play') }}
        </button>
        <a class="ghost-btn" href="#disco">{{ t('m_disco') }}</a>
      </div>
    </template>
    <template #art>
      <!-- обложка с пластинкой: пластинка выезжает и крутится, пока играет -->
      <div class="mu-hero" :class="{ spinning: relPlaying }">
        <Transition name="cover" mode="out-in">
          <button
            :key="release.id"
            type="button"
            class="mu-sleeve"
            :aria-label="`${relPlaying ? t('np_pause') : t('np_play')}: ${release.title}`"
            @click="playRelease"
          >
            <span class="mu-disc" aria-hidden="true"><i></i></span>
            <ReleaseCover :release="release" />
          </button>
        </Transition>
      </div>
    </template>

    <!-- плеер выбранного релиза -->
    <section id="release-main" class="wrap blk-first" :aria-label="t('m_featured')">
      <div class="mu-player glass">
        <div class="mu-info">
          <p class="mu-kind">
            <span>{{ t(`k_${release.kind}`) }}</span><span>{{ date(release.date) }}</span>
          </p>
          <h2>{{ release.title }}</h2>
          <p class="mu-genres">{{ release.genres.map((g) => genreLabel(g, lang)).join(' / ') }}</p>
          <p v-if="release.blurb" class="mu-blurb">{{ release.blurb[lang] }}</p>
          <div class="mu-ctrl">
            <button
              type="button"
              class="play-round"
              :aria-label="relPlaying ? t('np_pause') : t('np_play')"
              @click="playRelease"
            >
              <UiIcon :name="relPlaying ? 'pause' : 'play'" :size="22" />
            </button>
            <span class="mu-wave" :class="{ live: isCur }" @click="onWave">
              <TrackWave :playing="relPlaying" :progress="progress" :seed="seedOf(release.id)" :bars="72" />
            </span>
          </div>
          <div v-if="release.links?.length" class="mu-links">
            <a v-for="l in release.links" :key="l.name" :href="l.url" target="_blank" rel="noopener"
              >{{ l.name }} <UiIcon name="ext" :size="14"
            /></a>
          </div>
        </div>
        <TrackList :release="release" />
      </div>
    </section>

    <!-- дискография: крупные обложки -->
    <section id="disco" v-reveal class="wrap blk" aria-labelledby="disco-t">
      <div class="mu-disco-head">
        <h2 id="disco-t" class="blk-h">{{ t('m_disco') }}</h2>
        <div class="filters" role="group" :aria-label="t('m_disco')">
          <button
            v-for="k in kinds"
            :key="k"
            type="button"
            class="fchip"
            :class="{ on: filter === k }"
            :aria-pressed="filter === k"
            @click="filter = k"
          >
            {{ kindLabel(k) }}
          </button>
        </div>
      </div>
      <TransitionGroup tag="ul" name="gal" class="mu-releases">
        <li v-for="r in list" :key="r.id" class="mu-rel" :class="{ cur: r.id === release.id }">
          <button
            type="button"
            class="mu-rel-btn"
            :aria-label="`${t('m_show')}: ${r.title}`"
            @click="pick(r.id)"
          >
            <span class="mu-rel-cover">
              <ReleaseCover :release="r" small />
              <span class="mu-rel-play" aria-hidden="true"><UiIcon name="play" :size="22" /></span>
            </span>
            <span class="mu-rel-meta">
              <span>{{ t(`k_${r.kind}`) }}</span><span>{{ date(r.date) }}</span>
            </span>
            <b>{{ r.title }}</b>
            <small>{{ r.genres.map((g) => genreLabel(g, lang)).join(' / ') }}</small>
          </button>
        </li>
      </TransitionGroup>
    </section>

    <section v-reveal class="wrap blk" aria-labelledby="plat-t">
      <h2 id="plat-t" class="blk-h">{{ t('m_listen_on') }}</h2>
      <ul class="mu-plats stagger">
        <li v-for="(p, i) in platforms" :key="p.name.en" :style="{ '--i': i }">
          <a :href="p.url" target="_blank" rel="noopener"
            ><span>{{ tx(p.name, lang) }}</span> <UiIcon name="ext" :size="18"
          /></a>
        </li>
        <li :style="{ '--i': platforms.length }">
          <a :href="sc" target="_blank" rel="noopener"
            ><span>SoundCloud</span> <UiIcon name="ext" :size="18"
          /></a>
        </li>
      </ul>
    </section>
  </PageShell>
</template>

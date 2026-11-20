<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHead from '../components/PageHead.vue'
import PageShell from '../components/PageShell.vue'
import ReleaseCover from '../components/ReleaseCover.vue'
import UiIcon from '../components/UiIcon.vue'
import TrackList from '../components/TrackList.vue'
import { toggle, usePlayer } from '../composables/usePlayer'
import { useLang } from '../composables/useLang'
import { artistName, genreLabel, platforms, releases } from '../data/music'
import { tx } from '../utils/i18n'
import type { ReleaseKind } from '../data/types'
import { vReveal } from '../directives/reveal'
import { vTilt } from '../directives/tilt'
import { hrefFor } from '../utils/links'

const { lang, t } = useLang()

// в большой карточке показан выбранный релиз; по умолчанию главный — альбом
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
const sc = hrefFor('soundcloud')
const player = usePlayer()
const relPlaying = computed(() => player.release?.id === release.value.id && player.playing)
const playRelease = () => {
  const cur = player.release?.id === release.value.id ? player.index : -1
  toggle(release.value, cur >= 0 ? cur : 0)
}
const pick = (id: string) => {
  selectedId.value = id
  document.getElementById('release-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <PageShell tone="music">
    <PageHead :title="t('m_title')" :lead="t('m_hero_tag')" jp="音楽" />

    <section id="release-main" class="wrap mx-stage" :aria-label="t('m_featured')">
      <div v-tilt class="mx-card tilt">
        <div class="mx-cover">
          <ReleaseCover :key="release.id" :release="release" disc />
        </div>
        <div class="mx-info">
          <span class="kind-tag">{{ t(`k_${release.kind}`) }}</span>
          <h2>{{ release.title }}</h2>
          <p class="mx-sub">{{ artistName }} · {{ date(release.date) }}</p>
          <p class="mx-genres">{{ release.genres.map((g) => genreLabel(g, lang)).join(' / ') }}</p>
          <p v-if="release.blurb" class="mx-blurb">{{ release.blurb[lang] }}</p>
          <button type="button" class="mx-play" @click="playRelease">
            <UiIcon :name="relPlaying ? 'pause' : 'play'" />
            {{ relPlaying ? t('np_pause') : release.tracks.length > 1 ? t('np_play_album') : t('np_play') }}
          </button>
          <div v-if="release.links?.length" class="mx-links">
            <a
              v-for="l in release.links"
              :key="l.name"
              class="sc-btn"
              :href="l.url"
              target="_blank"
              rel="noopener"
              >{{ l.name }} <span aria-hidden="true">↗</span></a
            >
          </div>
        </div>
      </div>

      <TrackList :release="release" />
    </section>

    <section v-reveal class="wrap sec-tight" aria-labelledby="disco-t">
      <div class="disco-head">
        <h2 id="disco-t">{{ t('m_disco') }}</h2>
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
      <Transition name="grid" mode="out-in">
        <div :key="filter" class="releases">
          <article
            v-for="(r, i) in list"
            :key="r.id"
            v-tilt
            class="rel tilt"
            :class="{ cur: r.id === release.id }"
            :style="{ '--i': i }"
          >
            <button
              type="button"
              class="rel-cover"
              :aria-label="`${t('m_show')}: ${r.title}`"
              @click="pick(r.id)"
            >
              <ReleaseCover :release="r" small />
            </button>
            <div class="rel-body">
              <span class="kind-tag">{{ t(`k_${r.kind}`) }}</span>
              <h3>{{ r.title }}</h3>
              <p>{{ date(r.date) }}</p>
              <p class="g">{{ r.genres.map((g) => genreLabel(g, lang)).join(' / ') }}</p>
            </div>
          </article>
        </div>
      </Transition>
    </section>

    <section v-reveal class="wrap sec-tight" aria-labelledby="plat-t">
      <h2 id="plat-t" class="h2">{{ t('m_listen_on') }}</h2>
      <div class="plat-row">
        <a v-for="p in platforms" :key="p.name.en" class="plat" :href="p.url" target="_blank" rel="noopener"
          >{{ tx(p.name, lang) }} <span aria-hidden="true">↗</span></a
        >
        <a class="plat" :href="sc" target="_blank" rel="noopener"
          >SoundCloud <span aria-hidden="true">↗</span></a
        >
      </div>
    </section>
  </PageShell>
</template>

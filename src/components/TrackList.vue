<script setup lang="ts">
import { computed } from 'vue'
import UiIcon from './UiIcon.vue'
import { useLang } from '../composables/useLang'
import { downloadName, fmt, seek, toggle, trackUrl, usePlayer } from '../composables/usePlayer'
import type { Release } from '../data/types'

const props = defineProps<{ release: Release }>()
const { t } = useLang()
const p = usePlayer()

const isCur = (i: number) => p.release?.id === props.release.id && p.index === i
const isPlaying = (i: number) => isCur(i) && (p.playing || p.loading)
const pct = computed(() => (p.duration ? (p.time / p.duration) * 100 : 0))
const label = (i: number, title: string) => `${isPlaying(i) ? t('np_pause') : t('np_play')}: ${title}`
const onSeek = (e: Event) => seek(Number((e.target as HTMLInputElement).value))
</script>

<template>
  <ol class="tl" :aria-label="t('m_tracklist')">
    <li
      v-for="(tr, i) in release.tracks"
      :key="release.id + tr.title"
      class="tl-row"
      :class="{ on: isCur(i), playing: isCur(i) && p.playing }"
    >
      <div class="tl-line">
        <button
          type="button"
          class="tl-main"
          :aria-label="label(i, tr.title)"
          :aria-pressed="isCur(i) && p.playing"
          :disabled="!tr.src"
          @click="toggle(release, i)"
        >
          <span class="tl-n" aria-hidden="true">
            <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="eq"><i /><i /><i /></span>
            <UiIcon class="ic-play" name="play" />
            <UiIcon class="ic-pause" name="pause" />
          </span>
          <span class="tl-t">{{ tr.title }}</span>
          <span class="tl-len">{{ isCur(i) ? fmt(p.time) + ' / ' : '' }}{{ tr.length }}</span>
        </button>
        <span v-if="tr.src" class="tl-act">
          <button
            type="button"
            class="tl-btn pp"
            :aria-label="label(i, tr.title)"
            @click="toggle(release, i)"
          >
            <UiIcon :name="isPlaying(i) ? 'pause' : 'play'" />
          </button>
          <a
            class="tl-btn"
            :href="trackUrl(tr)"
            :download="downloadName(tr)"
            :aria-label="`${t('np_download')}: ${tr.title}`"
            :title="t('np_download')"
          >
            <UiIcon name="download" />
          </a>
        </span>
      </div>
      <div v-if="isCur(i)" class="tl-prog" :style="{ '--p': pct + '%' }">
        <input
          type="range"
          min="0"
          step="0.1"
          :max="p.duration || 0"
          :value="p.time"
          :aria-label="t('np_seek')"
          :disabled="!p.duration"
          @input="onSeek"
        />
      </div>
    </li>
  </ol>
</template>

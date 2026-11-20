<script setup lang="ts">
import UiIcon from './UiIcon.vue'
import ReleaseCover from './ReleaseCover.vue'
import { useLang } from '../composables/useLang'
import { close, fmt, next, pause, prev, resume, seek, usePlayer } from '../composables/usePlayer'

// Мини-плеер внизу: виден, пока что-то выбрано, и не пропадает при переходах между страницами.
const { t } = useLang()
const p = usePlayer()
const onSeek = (e: Event) => seek(Number((e.target as HTMLInputElement).value))
const pct = () => (p.duration ? (p.time / p.duration) * 100 : 0)
</script>

<template>
  <Transition name="np">
    <aside v-if="p.release" class="np" :class="{ playing: p.playing }" :aria-label="t('np_label')">
      <div class="np-cover"><ReleaseCover :release="p.release" small /></div>
      <div class="np-info">
        <b>{{ p.release.tracks[p.index]?.title }}</b>
        <span>{{ p.error ? t('np_error') : 'User1234 · ' + p.release.title }}</span>
      </div>
      <div class="np-ctl">
        <button type="button" class="np-btn" :aria-label="t('np_prev')" @click="prev()">
          <UiIcon name="prev" />
        </button>
        <button
          type="button"
          class="np-btn main"
          :aria-label="p.playing ? t('np_pause') : t('np_play')"
          @click="p.playing ? pause() : resume()"
        >
          <UiIcon :name="p.playing ? 'pause' : 'play'" />
        </button>
        <button type="button" class="np-btn" :aria-label="t('np_next')" @click="next(false)">
          <UiIcon name="next" />
        </button>
      </div>
      <div class="np-bar" :style="{ '--p': pct() + '%' }">
        <span class="np-t">{{ fmt(p.time) }}</span>
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
        <span class="np-t">{{ fmt(p.duration) }}</span>
      </div>
      <button type="button" class="np-btn x" :aria-label="t('np_close')" @click="close()">
        <UiIcon name="close" />
      </button>
    </aside>
  </Transition>
</template>

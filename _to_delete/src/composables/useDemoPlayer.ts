import { computed, reactive } from 'vue'
import { releases } from '../data/music'

// Демо-плеер: аудиофайлов нет, поэтому «воспроизведение» только считает время.
// Состояние общее, чтобы блок на странице и список релизов работали с одним плеером.
const state = reactive({ releaseId: releases[0]!.id, track: 0, playing: false, progress: 0 })
let timer: number | undefined

const toSeconds = (len: string) => {
  const [m = 0, s = 0] = len.split(':').map(Number)
  return m * 60 + s
}

const release = computed(() => releases.find((r) => r.id === state.releaseId) ?? releases[0]!)
const current = computed(() => release.value.tracks[state.track] ?? release.value.tracks[0]!)
const duration = computed(() => toSeconds(current.value.length))
const elapsed = computed(() => Math.floor(state.progress * duration.value))

const stopTimer = () => {
  if (timer !== undefined) window.clearInterval(timer)
  timer = undefined
}

function next() {
  const last = release.value.tracks.length - 1
  state.progress = 0
  if (state.track < last) state.track += 1
  else {
    state.track = 0
    state.playing = false
    stopTimer()
  }
}

function play() {
  state.playing = true
  stopTimer()
  timer = window.setInterval(() => {
    state.progress += 0.1 / duration.value
    if (state.progress >= 1) next()
  }, 100)
}

function pause() {
  state.playing = false
  stopTimer()
}

export const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

export function usePlayer() {
  return {
    state,
    release,
    current,
    duration,
    elapsed,
    toggle: () => (state.playing ? pause() : play()),
    pause,
    next,
    prev() {
      state.progress = 0
      if (state.track > 0) state.track -= 1
    },
    seek(p: number) {
      state.progress = Math.min(1, Math.max(0, p))
    },
    pick(id: string, track = 0) {
      state.releaseId = id
      state.track = track
      state.progress = 0
      play()
    },
    select(id: string) {
      if (id === state.releaseId) return
      pause()
      state.releaseId = id
      state.track = 0
      state.progress = 0
    },
  }
}

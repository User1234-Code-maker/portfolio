import { reactive } from 'vue'
import type { Release, Track } from '../data/types'

// Один общий плеер на весь сайт: музыка не прерывается при переходе между страницами.
// Файл начинает грузиться только после первого нажатия (preload = none).
const state = reactive({
  release: null as Release | null,
  index: -1,
  playing: false,
  loading: false,
  error: false,
  time: 0,
  duration: 0,
})

let audio: HTMLAudioElement | null = null

export const trackUrl = (track: Track) => `${import.meta.env.BASE_URL}${track.src ?? ''}`
export const downloadName = (track: Track) => `User1234 - ${track.title}.mp3`
export const fmt = (sec: number) => {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const s = Math.floor(sec)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function el(): HTMLAudioElement {
  if (audio) return audio
  audio = new Audio()
  audio.preload = 'none'
  audio.addEventListener('timeupdate', () => (state.time = audio!.currentTime))
  audio.addEventListener('durationchange', () => {
    if (Number.isFinite(audio!.duration)) state.duration = audio!.duration
  })
  audio.addEventListener('waiting', () => (state.loading = true))
  audio.addEventListener('canplay', () => (state.loading = false))
  audio.addEventListener('playing', () => {
    state.playing = true
    state.loading = false
    state.error = false
  })
  audio.addEventListener('pause', () => (state.playing = false))
  audio.addEventListener('error', () => {
    state.playing = false
    state.loading = false
    state.error = true
  })
  audio.addEventListener('ended', () => next(true))
  return audio
}

function updateSession(release: Release, track: Track) {
  if (!('mediaSession' in navigator)) return
  const art = release.cover ? [{ src: release.cover, sizes: '900x900', type: 'image/webp' }] : []
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: 'User1234',
    album: release.title,
    artwork: art,
  })
  navigator.mediaSession.setActionHandler('play', () => void resume())
  navigator.mediaSession.setActionHandler('pause', pause)
  navigator.mediaSession.setActionHandler('nexttrack', () => next(false))
  navigator.mediaSession.setActionHandler('previoustrack', prev)
}

function load(release: Release, index: number) {
  const track = release.tracks[index]
  if (!track?.src) return
  const a = el()
  state.release = release
  state.index = index
  state.time = 0
  state.duration = 0
  state.error = false
  state.loading = true
  a.src = trackUrl(track)
  updateSession(release, track)
  a.play().catch(() => {
    state.loading = false
    state.playing = false
  })
}

/** Нажали на трек: тот же трек ставится на паузу или продолжается, другой начинает играть */
export function toggle(release: Release, index: number) {
  if (state.release?.id === release.id && state.index === index) {
    if (state.playing || state.loading) pause()
    else void resume()
    return
  }
  load(release, index)
}

export function pause() {
  audio?.pause()
  state.loading = false
}
export async function resume() {
  if (!audio || !state.release) return
  try {
    await audio.play()
  } catch {
    state.playing = false
  }
}
export function next(auto: boolean) {
  const r = state.release
  if (!r) return
  const nx = r.tracks.findIndex((t, i) => i > state.index && t.src)
  if (nx >= 0) load(r, nx)
  else if (auto) {
    // дослушали до конца: остаёмся на последнем треке, но без звука
    state.playing = false
    state.time = 0
    if (audio) audio.currentTime = 0
  }
}
export function prev() {
  const r = state.release
  if (!r || !audio) return
  if (audio.currentTime > 3) {
    audio.currentTime = 0
    return
  }
  for (let i = state.index - 1; i >= 0; i--) {
    if (r.tracks[i]?.src) return load(r, i)
  }
  audio.currentTime = 0
}
export function seek(sec: number) {
  if (!audio || !Number.isFinite(sec)) return
  audio.currentTime = Math.max(0, Math.min(sec, state.duration || sec))
  state.time = audio.currentTime
}
export function close() {
  if (audio) {
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
  }
  state.release = null
  state.index = -1
  state.playing = false
  state.loading = false
  state.time = 0
  state.duration = 0
}

export function usePlayer() {
  return state
}

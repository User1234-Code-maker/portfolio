import { nextTick, ref, watchEffect } from 'vue'
import { site, type Lang } from '../data/site'

const STORAGE_KEY = 'lang'

function readSaved(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'ru' || v === 'en') return v
  } catch {
    /* localStorage может быть недоступен — не страшно */
  }
  return 'en'
}

// одно общее состояние языка на всё приложение
const lang = ref<Lang>(readSaved())

watchEffect(() => {
  document.documentElement.lang = lang.value
  try {
    localStorage.setItem(STORAGE_KEY, lang.value)
  } catch {
    /* ignore */
  }
})

export function useLang() {
  const t = (key: string): string => site.t[lang.value][key] ?? key
  // Смена языка: короткое мягкое затухание контента, текст меняется, пока он невидим.
  // Только opacity, без снимков экрана и blur, поэтому ничего не тормозит.
  const setLang = (l: Lang) => {
    if (l === lang.value) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lang.value = l
      return
    }
    const root = document.documentElement
    root.classList.add('lang-swap')
    window.setTimeout(() => {
      lang.value = l
      nextTick().then(() => requestAnimationFrame(() => root.classList.remove('lang-swap')))
    }, 140)
  }
  return { lang, t, setLang }
}

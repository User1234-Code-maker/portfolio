import { ref, watchEffect } from 'vue'
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
  const setLang = (l: Lang) => {
    lang.value = l
  }
  return { lang, t, setLang }
}

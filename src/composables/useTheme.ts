import { ref } from 'vue'

export type Theme = 'light' | 'dark'
const KEY = 'theme'

// Тема выставляется ещё в index.html до первой отрисовки (без вспышки), здесь только читаем
const theme = ref<Theme>(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function apply(next: Theme) {
  theme.value = next
  document.documentElement.dataset.theme = next
  try {
    localStorage.setItem(KEY, next)
  } catch {
    /* приватный режим — просто не запомним */
  }
}

// Плавная смена: браузер сам делает перекрёстное растворение старого и нового кадра (View Transitions).
// Где этого API нет или включён reduced-motion — тема меняется сразу.
export function setTheme(next: Theme) {
  if (next === theme.value) return
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  if (doc.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    doc.startViewTransition(() => apply(next))
  } else apply(next)
}

export function useTheme() {
  const toggle = () => setTheme(theme.value === 'dark' ? 'light' : 'dark')
  return { theme, setTheme, toggle }
}

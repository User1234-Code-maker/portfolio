// Заставка живёт в index.html (рисуется до загрузки скриптов). Здесь только решаем, когда её убрать:
// не раньше, чем доиграет «рисование», и не позже жёсткого потолка.
const MIN_MS = 1500
const MAX_MS = 2600

export const BOOT_KEY = 'boot-v1'

function ready(img: HTMLImageElement | null) {
  if (!img) return Promise.resolve()
  return img.decode ? img.decode().catch(() => undefined) : Promise.resolve()
}

export function finishBoot() {
  const el = document.getElementById('boot')
  const root = document.documentElement
  if (!el) return
  if (root.classList.contains('no-boot')) {
    el.remove()
    return
  }

  const started = Number((window as unknown as { __bootT?: number }).__bootT) || performance.now()
  const hero = document.querySelector<HTMLImageElement>('.l-char img.main')
  let closed = false

  const close = () => {
    if (closed) return
    closed = true
    try {
      localStorage.setItem(BOOT_KEY, '1')
    } catch {
      /* без localStorage заставка просто покажется снова */
    }
    el.classList.add('out')
    root.classList.remove('booting')
    window.setTimeout(() => el.remove(), 900)
  }

  const wait = Math.max(0, MIN_MS - (performance.now() - started))
  Promise.race([ready(hero), new Promise((r) => setTimeout(r, MAX_MS - 400))]).then(() =>
    setTimeout(close, wait),
  )
  // пропустить: клик или любая клавиша
  el.addEventListener('pointerdown', close, { once: true })
  window.addEventListener('keydown', close, { once: true })
  setTimeout(close, MAX_MS)
}

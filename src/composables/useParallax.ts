import { onBeforeUnmount, onMounted, type Ref } from 'vue'

// Параллакс слоёв: курсор + прокрутка. Слои помечены data-par="сила".
export function useParallax(root: Ref<HTMLElement | null>) {
  let raf = 0
  let stop: (() => void) | null = null

  onMounted(() => {
    const el = root.value
    // на сенсорных экранах параллакса нет: в Chrome и Telegram он давал рывки при прокрутке
    if (!el || matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return

    const layers = [...el.querySelectorAll<HTMLElement>('[data-par]')]
    let mx = 0
    let my = 0
    let tx = 0
    let ty = 0
    let sy = 0

    const onMove = (e: PointerEvent) => {
      tx = e.clientX / innerWidth - 0.5
      ty = e.clientY / innerHeight - 0.5
      wake()
    }
    const onScroll = () => {
      sy = Math.min(scrollY, innerHeight)
      wake()
    }
    addEventListener('pointermove', onMove, { passive: true })
    addEventListener('scroll', onScroll, { passive: true })

    // кадры считаем только пока слои ещё движутся — в покое процессор не греется
    let running = false
    const wake = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    const loop = () => {
      mx += (tx - mx) * 0.07
      my += (ty - my) * 0.07
      for (const l of layers) {
        const k = Number(l.dataset.par)
        const base = l.classList.contains('l-city') ? ' scale(1.06)' : ''
        l.style.transform = `translate3d(${-mx * k}px, ${-my * k * 0.6 - sy * k * 0.012}px, 0)${base}`
      }
      if (Math.abs(tx - mx) < 0.0005 && Math.abs(ty - my) < 0.0005) {
        running = false
        return
      }
      raf = requestAnimationFrame(loop)
    }
    wake()

    stop = () => {
      removeEventListener('pointermove', onMove)
      removeEventListener('scroll', onScroll)
    }
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    stop?.()
  })
}

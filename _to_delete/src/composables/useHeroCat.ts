import { onBeforeUnmount, onMounted, type Ref } from 'vue'

// Котик в Hero: внешний вид не меняется, но он подпрыгивает, когда курсор подходит близко
// или по нему кликнули. Под reduced-motion и на тач-экранах без подвижности остаётся как был.
export function useHeroCat(el: Ref<HTMLElement | null>) {
  let raf = 0
  let cooldown = 0

  const hop = () => {
    const cat = el.value
    if (!cat || performance.now() < cooldown) return
    cooldown = performance.now() + 900
    cat.classList.remove('hop')
    void cat.offsetWidth
    cat.classList.add('hop')
  }

  const onMove = (e: PointerEvent) => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      const r = el.value?.getBoundingClientRect()
      if (!r) return
      if (Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < 80) hop()
    })
  }

  onMounted(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    window.addEventListener('pointermove', onMove, { passive: true })
    el.value?.addEventListener('animationend', () => el.value?.classList.remove('hop'))
    el.value?.addEventListener('click', hop)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onMove)
    cancelAnimationFrame(raf)
  })
}

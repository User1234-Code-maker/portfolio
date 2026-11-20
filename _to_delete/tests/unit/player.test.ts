import { describe, expect, it, afterEach, vi } from 'vitest'
import { fmt, usePlayer } from '../../src/composables/useDemoPlayer'

describe('демо-плеер', () => {
  afterEach(() => {
    usePlayer().pause()
    vi.useRealTimers()
  })

  it('форматирует время', () => {
    expect(fmt(0)).toBe('0:00')
    expect(fmt(65)).toBe('1:05')
  })

  it('прогресс идёт при игре и стоит на паузе', () => {
    vi.useFakeTimers()
    const p = usePlayer()
    p.pick('sky-signal', 0)
    vi.advanceTimersByTime(3000)
    const moved = p.state.progress
    expect(moved).toBeGreaterThan(0)
    p.pause()
    vi.advanceTimersByTime(3000)
    expect(p.state.progress).toBe(moved)
  })

  it('seek ограничивает значение, prev не уходит ниже первого трека', () => {
    const p = usePlayer()
    p.select('sky-signal')
    p.seek(5)
    expect(p.state.progress).toBe(1)
    p.seek(-1)
    expect(p.state.progress).toBe(0)
    p.prev()
    expect(p.state.track).toBe(0)
  })

  it('переключение релиза сбрасывает трек и ставит паузу', () => {
    const p = usePlayer()
    p.pick('sky-signal', 2)
    p.select('neon-cat')
    expect(p.state.playing).toBe(false)
    expect(p.state.track).toBe(0)
    expect(p.release.value.id).toBe('neon-cat')
  })
})

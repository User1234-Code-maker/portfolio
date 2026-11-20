import { describe, expect, it, beforeEach, vi } from 'vitest'
import { BOOT_KEY, finishBoot } from '../../src/boot'

describe('заставка', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    document.documentElement.className = ''
    document.body.innerHTML = '<div id="boot"></div>'
    vi.useFakeTimers()
  })

  it('не делает ничего, если заставка отключена (повторный визит или reduced-motion)', () => {
    document.documentElement.classList.add('no-boot')
    finishBoot()
    vi.advanceTimersByTime(5000)
    expect(document.getElementById('boot')).toBeNull()
  })

  it('убирает заставку не позже жёсткого потолка и запоминает визит', async () => {
    document.documentElement.classList.add('booting')
    finishBoot()
    await vi.advanceTimersByTimeAsync(1700)
    expect(document.getElementById('boot')?.classList.contains('out')).toBe(true)
    expect(document.documentElement.classList.contains('booting')).toBe(false)
    expect(sessionStorage.getItem(BOOT_KEY)).toBe('1')
    await vi.advanceTimersByTimeAsync(1200)
    expect(document.getElementById('boot')).toBeNull()
  })

  it('пропускается кликом сразу', () => {
    document.documentElement.classList.add('booting')
    finishBoot()
    document.getElementById('boot')!.dispatchEvent(new Event('pointerdown'))
    expect(document.getElementById('boot')!.classList.contains('out')).toBe(true)
  })
})

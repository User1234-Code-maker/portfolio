const { chromium, devices } = require('playwright')
;(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
  for (const path of ['/', '/music', '/about', '/projects', '/contact', '/projects/portfolio-site']) {
    const c = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 664 } })
    const p = await c.newPage()
    await p.addInitScript(() => {
      sessionStorage.setItem('boot-v1', '1')
      window.__s = 0
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__s += e.value
      }).observe({ type: 'layout-shift' })
    })
    await p.goto('http://localhost:4173' + path)
    await p.waitForTimeout(2500)
    const cdp = await c.newCDPSession(p)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await p.evaluate(() => (window.__s = 0))
    // следим за позицией заголовка относительно документа: она не должна меняться никогда
    await p.evaluate(() => {
      const h = document.querySelector('h1')
      const base = h.getBoundingClientRect().top + scrollY
      window.__drift = 0
      const tick = () => {
        window.__drift = Math.max(window.__drift, Math.abs(h.getBoundingClientRect().top + scrollY - base))
        requestAnimationFrame(tick)
      }
      tick()
    })
    let back = 0
    for (let k = 0; k < 6; k++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: 600 }] })
      for (let i = 1; i <= 10; i++) {
        await cdp.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x: 200, y: 600 - i * 40 }],
        })
        await p.waitForTimeout(16)
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await p.setViewportSize({ width: 390, height: k % 2 ? 664 : 750 }) // панель прячется/появляется
      const y0 = await p.evaluate(() => scrollY)
      await p.waitForTimeout(500)
      const y1 = await p.evaluate(() => scrollY)
      if (y1 < y0 - 1) back++ // страница дёрнулась назад
    }
    const r = await p.evaluate(() => ({
      y: Math.round(scrollY),
      cls: +window.__s.toFixed(4),
      drift: Math.round(window.__drift),
    }))
    console.log(
      path.padEnd(26),
      'прокрутил до',
      r.y,
      '| сдвиг вёрстки (CLS)',
      r.cls,
      '| уплыл заголовок, px',
      r.drift,
      '| откаты назад',
      back,
    )
    await c.close()
  }
  await b.close()
})()

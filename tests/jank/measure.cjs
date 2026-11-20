// Замер «дёрганья»: 1) меняем высоту окна посреди скролла (как прячется панель в Telegram/Chrome на iPhone)
// и смотрим, сдвинулись ли элементы страницы; 2) скроллим пальцем (touch-жест) и ловим layout shift.
const { chromium, devices } = require('playwright')
;(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
  const out = {}
  for (const path of ['/', '/music', '/about', '/projects', '/contact']) {
    const c = await b.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 664 } })
    const p = await c.newPage()
    await p.addInitScript(() => {
      sessionStorage.setItem('boot-v1', '1')
      window.__shifts = 0
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__shifts += e.value
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await p.goto('http://localhost:4173' + path)
    await p.waitForTimeout(2500)
    // позиция элементов относительно экрана; при ровной странице смена высоты окна их не двигает
    const probe = () =>
      p.evaluate(() =>
        [...document.querySelectorAll('h1, h2, .hero .wrap, .l-char img.main, main')]
          .slice(0, 8)
          .map((e) => Math.round(e.getBoundingClientRect().top)),
      )
    let maxJump = 0
    for (const y of [0, 150, 400]) {
      await p.evaluate((v) => window.scrollTo(0, v), y)
      await p.waitForTimeout(1500)
      const a = await probe()
      await p.setViewportSize({ width: 390, height: 750 }) // панель спряталась
      await p.waitForTimeout(300)
      const b2 = await probe()
      await p.setViewportSize({ width: 390, height: 664 }) // панель вернулась
      await p.waitForTimeout(300)
      for (let i = 0; i < a.length; i++) maxJump = Math.max(maxJump, Math.abs(a[i] - b2[i]))
    }
    // скролл пальцем по всей странице
    await p.evaluate(() => window.scrollTo(0, 0))
    await p.waitForTimeout(300)
    const cdp = await c.newCDPSession(p)
    const before = await p.evaluate(() => window.__shifts)
    for (let i = 0; i < 8; i++)
      await cdp.send('Input.synthesizeScrollGesture', { x: 200, y: 500, yDistance: -500, gestureSourceType: 'touch', speed: 1600 })
    await p.waitForTimeout(500)
    const sy = await p.evaluate(() => scrollY)
    const shift = (await p.evaluate(() => window.__shifts)) - before
    out[path] = { resizeJumpPx: maxJump, touchScrolledTo: sy, layoutShiftDuringScroll: +shift.toFixed(4) }
    await c.close()
  }
  console.log(JSON.stringify(out, null, 1))
  await b.close()
})()

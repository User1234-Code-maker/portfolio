const { chromium, devices } = require('playwright')
;(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
  for (const [w, h] of [[390, 664], [430, 760]]) {
    const c = await b.newContext({ ...devices['iPhone 13'], viewport: { width: w, height: h } })
    const p = await c.newPage()
    await p.addInitScript(() => sessionStorage.setItem('boot-v1', '1'))
    await p.goto('http://localhost:4173/'); await p.waitForTimeout(2500)
    const m = () => p.evaluate(() => {
      const r = document.querySelector('.l-char img.main').getBoundingClientRect()
      const hh = document.querySelector('.hero').getBoundingClientRect()
      return `img ${Math.round(r.width)}x${Math.round(r.height)} top ${Math.round(r.top + scrollY)} | hero h ${Math.round(hh.height)}`
    })
    console.log(`${w}x${h}`, 'старт        ', await m())
    for (const hh of [h + 90, h + 180, h]) { await p.setViewportSize({ width: w, height: hh }); await p.waitForTimeout(500); console.log(`${w}x${hh}`.padEnd(9), 'высота окна', String(hh).padEnd(4), await m()) }
    await c.close()
  }
  await b.close()
})()

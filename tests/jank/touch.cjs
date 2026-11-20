const { chromium, devices } = require('playwright')
;(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
  for (const url of ['data:text/html,<div style="height:5000px;background:linear-gradient(red,blue)"></div>', 'http://localhost:4173/', 'http://localhost:4173/music']) {
    const c = await b.newContext({ ...devices['iPhone 13'] })
    const p = await c.newPage()
    await p.addInitScript(() => { try { sessionStorage.setItem('boot-v1', '1') } catch {} })
    await p.goto(url); await p.waitForTimeout(2500)
    const cdp = await c.newCDPSession(p)
    // обычный свайп пальцем: касание, движение вверх, отпускание
    const sw = async () => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: 600 }] })
      for (let i = 1; i <= 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y: 600 - i * 40 }] }); await p.waitForTimeout(16) }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await p.waitForTimeout(700)
      return p.evaluate(() => Math.round(scrollY))
    }
    const r = [await sw(), await sw(), await sw()]
    console.log(url.slice(0, 40), 'после 1/2/3 свайпа scrollY =', r.join(' / '))
    await c.close()
  }
  await b.close()
})()

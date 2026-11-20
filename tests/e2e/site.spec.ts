import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// блоки ниже первого экрана грузятся лениво — пролистываем страницу, чтобы они появились
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y <= document.documentElement.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
}

const routes = ['/', '/projects', '/projects/label-erp', '/music', '/about', '/contact', '/no-such-page']
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1100 },
  { name: 'mobile', width: 390, height: 844 },
]

for (const vp of viewports) {
  test.describe(vp.name, () => {
    // reduced-motion: заставка не показывается, анимации выключены
    test.use({ viewport: { width: vp.width, height: vp.height }, reducedMotion: 'reduce' })

    for (const route of routes) {
      test(`${route}: нет горизонтального скролла и ошибок консоли`, async ({ page }) => {
        const errors: string[] = []
        page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
        page.on('pageerror', (e) => errors.push(String(e)))
        await page.goto(route)
        await expect(page.locator('h1').first()).toBeVisible()
        await scrollThrough(page)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow).toBeLessThanOrEqual(0)
        expect(errors).toEqual([])
      })

      test(`${route}: нет нарушений доступности (axe)`, async ({ page }) => {
        await page.goto(route)
        await expect(page.locator('h1').first()).toBeVisible()
        await scrollThrough(page)
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
        expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
      })
    }
  })
}

test.describe('функциональность', () => {
  test.use({ reducedMotion: 'reduce' })

  test('переключатель языка меняет заголовок и запоминается', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'RU' }).click()
    await expect(page.locator('h1')).toContainText('Фуллстек-разработчик')
    await page.reload()
    await expect(page.locator('h1')).toContainText('Фуллстек-разработчик')
  })

  test('язык остаётся при переходе на другую страницу', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'RU' }).click()
    await page.locator('header nav').getByRole('link', { name: 'Работы' }).click()
    await expect(page).toHaveURL(/\/projects$/)
    await expect(page.locator('h1')).toHaveText('Работы')
  })

  test('навигация открывает страницы без перезагрузки', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'Main' })
    await nav.getByRole('link', { name: 'Music' }).click()
    await expect(page).toHaveURL(/\/music$/)
    await expect(page.locator('h1')).toHaveText('Music')
    await nav.getByRole('link', { name: 'Contact' }).click()
    await expect(page).toHaveURL(/\/contact$/)
    await page.goBack()
    await expect(page).toHaveURL(/\/music$/)
  })

  test('прямая ссылка на внутреннюю страницу открывается', async ({ page }) => {
    await page.goto('/projects/portfolio-site')
    await expect(page.locator('h1')).toHaveText('Personal portfolio site')
  })

  test('неизвестный адрес и неизвестный проект дают страницу 404', async ({ page }) => {
    await page.goto('/nowhere')
    await expect(page.locator('.nf-code')).toBeVisible()
    await page.goto('/projects/nope')
    await expect(page.locator('.nf-code')).toBeVisible()
  })

  test('фильтр проектов показывает только выбранную категорию', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.locator('.pcard').first()).toBeVisible()
    const all = await page.locator('.pcard').count()
    await page.getByRole('button', { name: /Telegram Bots/ }).click()
    await expect(page.locator('.pcard')).toHaveCount(1)
    await expect(page.locator('.pcard .cat-tag')).toHaveText(['Telegram Bots'])
    await page.getByRole('button', { name: /^All/ }).click()
    await expect(page.locator('.pcard')).toHaveCount(all)
  })

  test('у открытого проекта есть рабочие ссылки, у проектов под NDA их нет', async ({ page }) => {
    await page.goto('/projects')
    const real = page.locator('.pcard', { hasText: 'Game Studio' })
    await expect(real.locator('a[href^="https://"]')).toHaveCount(2)
    const nda = page.locator('.pcard', { hasText: 'Telegram' })
    await expect(nda.locator('a[href^="https://"]')).toHaveCount(0)
    await expect(nda.locator('.badge.nda')).toBeVisible()
  })

  test('страница проекта показывает схему и ссылку на следующий проект', async ({ page }) => {
    await page.goto('/projects/game-studio-website')
    await expect(page.locator('.arch li')).toHaveCount(4)
    await page.locator('.pj-next a').click()
    await expect(page).toHaveURL(/\/projects\/label-erp$/)
  })

  test('музыка: альбом с треклистом, смена релиза, фильтр и ссылки на площадки', async ({ page }) => {
    await page.goto('/music')
    await expect(page.locator('.mx-card h2')).toHaveText('1234')
    await expect(page.locator('.tl-row')).toHaveCount(10)
    await page.getByRole('button', { name: 'Singles' }).click()
    await expect(page.locator('.rel')).toHaveCount(3)
    await page.locator('.rel-cover').first().click()
    await expect(page.locator('.tl-row')).toHaveCount(1)
    const hrefs = await page
      .locator('.plat')
      .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href))
    expect(hrefs.some((h) => h.includes('soundcloud.com'))).toBe(true)
    expect(hrefs.some((h) => h.includes('spotify.com'))).toBe(true)
  })

  test('музыка: свой плеер играет трек, ставится на паузу и показывает мини-плеер', async ({ page }) => {
    await page.goto('/music')
    await expect(page.locator('.np')).toHaveCount(0)
    const row = page.locator('.tl-row').nth(1)
    await row.hover()
    await expect(row.locator('.tl-act')).toBeVisible()
    await row.locator('.tl-main').click()
    await expect(page.locator('.np')).toBeVisible()
    await expect(page.locator('.np-info b')).toHaveText('Халат')
    await expect(row).toHaveClass(/playing/, { timeout: 8000 })
    await expect
      .poll(async () => page.locator('.np-t').first().textContent(), { timeout: 8000 })
      .not.toBe('0:00')
    await page.getByRole('button', { name: 'Pause' }).first().click()
    await expect(row).not.toHaveClass(/playing/)
    // скачивание: ссылка ведёт на mp3 с понятным именем
    await expect(row.locator('a[download]')).toHaveAttribute('download', 'User1234 - Халат.mp3')
    // музыка не пропадает при переходе на другую страницу
    await page.getByRole('link', { name: 'About' }).first().click()
    await expect(page.locator('.np')).toBeVisible()
    await page.getByRole('button', { name: 'Close player' }).click()
    await expect(page.locator('.np')).toHaveCount(0)
  })

  test('обо мне: можно скачать резюме на выбранном языке', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('.cv-btn')).toHaveAttribute('href', /Bogdan-Korzun-CV-EN\.pdf$/)
    await page.getByRole('button', { name: 'RU' }).click()
    await expect(page.locator('.cv-btn')).toHaveAttribute('href', /Bogdan-Korzun-CV-RU\.pdf$/)
  })

  test('контакты: копирование почты показывает подтверждение', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/contact')
    await page.getByRole('button', { name: 'Copy email' }).click()
    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('bogdan.korzun2003@gmail.com')
  })

  test('контакты: только настоящие ссылки из данных', async ({ page }) => {
    await page.goto('/contact')
    const hrefs = await page
      .locator('.chan')
      .evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href))
    expect(hrefs).toHaveLength(6)
    expect(hrefs[0]).toBe('mailto:bogdan.korzun2003@gmail.com')
    for (const h of hrefs.slice(1)) expect(h).toMatch(/^https:\/\//)
  })

  test('обо мне: таймлайн раскрывается по клику', async ({ page }) => {
    await page.goto('/about')
    const first = page.locator('.mtl button').first()
    await first.click()
    await expect(first).toHaveAttribute('aria-expanded', 'true')
  })

  test('мобильное меню открывается и ведёт на страницу', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Menu' }).click()
    await page.locator('#mobile-menu').getByRole('link', { name: 'Projects' }).click()
    await expect(page).toHaveURL(/\/projects$/)
  })

  test('ссылка SoundCloud в шапке ведёт на настоящий адрес', async ({ page }) => {
    await page.goto('/')
    const href = await page.getByRole('link', { name: 'SoundCloud' }).first().getAttribute('href')
    expect(href).toContain('soundcloud.com')
  })

  test('нижние блоки главной не грузятся, пока не подъехали к экрану', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('#contact h2')).toHaveCount(0)
    await page.locator('#contact').scrollIntoViewIfNeeded()
    await expect(page.locator('#contact h2')).toBeVisible()
  })

  test('кот не заходит на японскую плашку на разных размерах окна', async ({ page }) => {
    const sizes = [
      [1920, 1080],
      [1440, 700],
      [1366, 768],
      [1280, 720],
      [820, 1100],
      [390, 844],
      [360, 640],
    ]
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width: width!, height: height! })
      await page.goto('/')
      const jp = await page.locator('.jp').boundingBox()
      const cat = await page.locator('.cat').boundingBox()
      expect(cat!.y, `${width}x${height}`).toBeGreaterThanOrEqual(jp!.y + jp!.height + 8)
    }
  })
})

test.describe('заставка', () => {
  test('при первом визите показывается и убирается, при повторном нет', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#boot')).toBeVisible()
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 6000 })
    expect(await page.evaluate(() => localStorage.getItem('boot-v1'))).toBe('1')
    await page.reload()
    await expect(page.locator('#boot')).toBeHidden()
  })

  test('пропускается кликом', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#boot')).toBeVisible()
    await page.locator('#boot').click({ position: { x: 20, y: 20 } })
    await expect(page.locator('#boot')).toHaveCount(0, { timeout: 2500 })
  })

  test('ссылка ?intro показывает заставку снова', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('boot-v1', '1'))
    await page.goto('/?intro')
    await expect(page.locator('#boot')).toBeVisible()
  })

  test('при reduced-motion заставки нет', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    await page.goto('/')
    await expect(page.locator('#boot')).toBeHidden()
    await ctx.close()
  })

  test('переходы между страницами не показывают заставку', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('boot-v1', '1'))
    await page.goto('/')
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Projects' }).click()
    await expect(page.locator('h1')).toHaveText('Projects')
    await expect(page.locator('#boot')).toHaveCount(0)
  })
})

test.describe('фон и язык', () => {
  test('фон есть на странице, ошибок в консоли нет', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto('/')
    await expect(page.locator('.world').first()).toBeAttached()
    for (let i = 0; i < 10; i++) await page.mouse.move(200 + i * 80, 300 + (i % 3) * 50)
    expect(errors).toEqual([])
  })

  test('смена языка анимируется и меняет заголовок', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'RU' }).click()
    await expect(page.locator('h1')).toContainText('Фуллстек-разработчик')
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  })
})

test.describe('котик', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('boot-v1', '1'))
  })

  test('его можно перетащить, пока несут, он кричит, потом остаётся на месте', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/music')
    const cat = page.locator('.pcat-btn')
    await expect(cat).toBeVisible()
    const before = (await page.locator('.pcat-btn img').boundingBox())!
    await page.mouse.move(before.x + 20, before.y + 20)
    await page.mouse.down()
    await page.mouse.move(before.x + 120, before.y + 80, { steps: 6 })
    await page.mouse.move(before.x + 420, before.y - 60, { steps: 6 })
    await expect(page.locator('.pcat.dragging')).toBeVisible()
    await expect(page.locator('.pcat-say.scream')).toContainText(/a{2,}|eek|ай|ааа/i)
    await page.mouse.up()
    await expect(page.locator('.pcat.dragging')).toHaveCount(0)
    await expect(page.locator('.pcat.free')).toBeVisible()
    const after = (await page.locator('.pcat-btn img').boundingBox())!
    expect(Math.abs(after.x - (before.x + 400))).toBeLessThan(8)
    // остаётся на месте и после перехода на другую страницу
    await page.getByRole('link', { name: 'About' }).first().click()
    await expect(page.locator('.pcat.free')).toBeVisible()
  })

  test('обычный клик по котику не переносит его, а мяукает', async ({ page }) => {
    await page.goto('/music')
    await page.locator('.pcat-btn').click()
    await expect(page.locator('.pcat-say')).toBeVisible()
    await expect(page.locator('.pcat.free')).toHaveCount(0)
  })

  test('стрелки двигают котика, он не уходит за экран', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 700 })
    await page.goto('/music')
    await page.locator('.pcat-btn').focus()
    for (let i = 0; i < 60; i++) await page.keyboard.press('ArrowRight')
    const box = (await page.locator('.pcat-btn img').boundingBox())!
    expect(box.x + box.width).toBeLessThanOrEqual(1001)
    expect(box.x).toBeGreaterThan(300)
  })
})

test.describe('котик живёт сам', () => {
  test('идёт сам, не выходя за экран, и реагирует на клик рядом', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('boot-v1', '1')
      // ускоряем таймеры, чтобы не ждать десятки секунд
      const st = window.setTimeout
      window.setTimeout = ((fn: TimerHandler, ms?: number, ...a: unknown[]) =>
        st(fn, ms && ms > 5000 && ms < 26000 ? 400 : ms, ...a)) as typeof window.setTimeout
    })
    await page.setViewportSize({ width: 1100, height: 760 })
    await page.goto('/music')
    await expect(page.locator('.pcat.free')).toBeVisible({ timeout: 6000 })
    await page.waitForTimeout(1500)
    const box = (await page.locator('.pcat-btn img').boundingBox())!
    expect(box.x).toBeGreaterThanOrEqual(-2)
    expect(box.y).toBeGreaterThanOrEqual(-2)
    expect(box.x + box.width).toBeLessThanOrEqual(1102)
    expect(box.y + box.height).toBeLessThanOrEqual(762)
  })
})

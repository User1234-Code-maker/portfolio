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

const routes = [
  '/',
  '/projects',
  '/projects/label-erp-panel',
  '/music',
  '/about',
  '/contact',
  '/no-such-page',
]
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
    await page.goto('/projects/artist-crm')
    await expect(page.locator('h1')).toHaveText('Artist CRM')
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
    await expect(page.locator('.pcard')).toHaveCount(2)
    await expect(page.locator('.pcard .cat-tag')).toHaveText(['Telegram Bots', 'Telegram Bots'])
    await page.getByRole('button', { name: /^All/ }).click()
    await expect(page.locator('.pcard')).toHaveCount(all)
  })

  test('у настоящего проекта есть рабочие ссылки, у примеров их нет', async ({ page }) => {
    await page.goto('/projects')
    const real = page.locator('.pcard', { hasText: 'Game Studio Website' })
    await expect(real.locator('a[href^="https://"]')).toHaveCount(2)
    const sample = page.locator('.pcard', { hasText: 'Label ERP Panel' })
    await expect(sample.locator('a[href^="https://"]')).toHaveCount(0)
    await expect(sample.locator('.badge')).toBeVisible()
  })

  test('страница проекта показывает схему и ссылку на следующий проект', async ({ page }) => {
    await page.goto('/projects/game-studio-website')
    await expect(page.locator('.arch li')).toHaveCount(4)
    await page.locator('.pj-next a').click()
    await expect(page).toHaveURL(/\/projects\/label-erp-panel$/)
  })

  test('демо-плеер: запуск, пауза, переключение трека, перемотка', async ({ page }) => {
    await page.goto('/music')
    const play = page.locator('.ctl.main')
    await play.click()
    await expect(page.locator('.mx-card')).toHaveClass(/playing/)
    await page.getByRole('button', { name: 'Next track' }).click()
    await expect(page.locator('.mx-now b')).toHaveText('Cloud Index')
    await play.click()
    await expect(page.locator('.mx-card')).not.toHaveClass(/playing/)
    await page.locator('.wavebars').focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('.wavebars')).toHaveAttribute('aria-valuenow', '5')
  })

  test('музыка: фильтр дискографии и ссылка на SoundCloud', async ({ page }) => {
    await page.goto('/music')
    await page.getByRole('button', { name: 'Singles' }).click()
    await expect(page.locator('.rel')).toHaveCount(2)
    const href = await page
      .getByRole('link', { name: /SoundCloud/ })
      .first()
      .getAttribute('href')
    expect(href).toContain('soundcloud.com')
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

test.describe('игровой слой и котик', () => {
  test('фон и котик есть на странице, ошибок нет', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto('/')
    await expect(page.locator('.world').first()).toBeAttached()
    for (let i = 0; i < 10; i++) await page.mouse.move(200 + i * 80, 300 + (i % 3) * 50)
    await expect(page.locator('.pcat')).toBeAttached()
    expect(errors).toEqual([])
  })

  test('смена языка анимируется и меняет заголовок', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'RU' }).click()
    await expect(page.locator('h1')).toContainText('Фуллстек-разработчик')
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
  })
})

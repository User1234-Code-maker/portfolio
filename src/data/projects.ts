/* ─────────────────────────────────────────────────────────────
   ПРОЕКТЫ. Чтобы добавить свой, скопируй блок и поменяй поля.
   nda: true — проект под NDA: без ссылок и скриншотов, с бейджем NDA.
   sample: true — демонстрационный кейс: без ссылок, с бейджем «Пример».
   Настоящий проект отличается тем, что у него есть repo и/или demo.
   ───────────────────────────────────────────────────────────── */
import coverGameStudio from '../assets/img/cover-game-studio.webp'
import coverPortfolio from '../assets/img/cover-portfolio.webp'
import shot1 from '../assets/img/shot-portfolio-1.webp'
import shot2 from '../assets/img/shot-portfolio-2.webp'
import shot3 from '../assets/img/shot-portfolio-3.webp'
import type { Category, Project } from './types'

export const categories: Category[] = ['web', 'erp', 'bots']

export const projects: Project[] = [
  {
    slug: 'game-studio-website',
    title: 'Game Studio Website',
    category: 'web',
    ru: 'Сайт игровой студии: каталог, корзина и оплата через Stripe.',
    en: 'Game studio site: catalogue, cart and Stripe checkout.',
    long: {
      ru: 'Первый большой проект: многостраничный сайт игровой студии по макету. Каталог игр, корзина, оформление заказа и оплата картой через Stripe. Фронтенд на React, серверная часть на Node.js, данные в PostgreSQL.',
      en: 'My first big project: a multi-page game studio site built from a mockup. Game catalogue, cart, checkout and card payments through Stripe. React frontend, Node.js backend, data in PostgreSQL.',
    },
    role: { ru: 'Фуллстек-разработчик', en: 'Fullstack developer' },
    year: '2026',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    arch: [
      { label: 'React' },
      { label: 'Node.js API' },
      { label: 'PostgreSQL' },
      { label: 'Stripe', note: { ru: 'оплата', en: 'payments' } },
    ],
    repo: 'https://github.com/User1234-Code-maker/game-studio-site',
    demo: 'https://game-studio-site.onrender.com',
    cover: coverGameStudio,
    hue: 232,
    featured: true,
  },
  {
    slug: 'label-erp',
    title: 'ERP для музыкального лейбла',
    category: 'erp',
    ru: 'Внутренняя ERP-система: разделы Distribution и Support, таблицы с сохранением состояния.',
    en: 'In-house ERP system: Distribution and Support sections, tables that remember their state.',
    long: {
      ru: 'Внутренняя ERP-система музыкального лейбла. Участвую в разработке модулей: Distribution и Support. Самая большая задача: сохранение состояния таблиц на AG Grid с версионированием схемы, защитой от конфликтов при одновременной правке и синхронизацией между вкладками. Я прошёл её целиком, от архитектурных решений и постановки задач до релиза в продакшен. Кроме того, провёл несколько раундов доработок интерфейса: исправил системные ошибки позиционирования, унифицировал компоненты и сделал адаптивную вёрстку. Для разделов написал инструкции в Notion.',
      en: 'The in-house ERP system of a music label. I take part in building its modules, Distribution and Support. The biggest task was saving table state on AG Grid with schema versioning, protection from conflicts during simultaneous edits and synchronisation between tabs. I carried it through from architecture decisions and task breakdown to the production release. I also ran several rounds of interface improvements: fixed systemic positioning bugs, unified components and built a responsive layout. I wrote the user guides for these sections in Notion.',
    },
    role: { ru: 'Системный аналитик, фуллстек-разработчик', en: 'Systems analyst, fullstack developer' },
    year: '2025',
    tech: ['React 19', 'AG Grid', 'HeroUI', 'Tailwind v4'],
    arch: [
      { label: { ru: 'Интерфейс', en: 'Interface' }, note: { ru: 'React', en: 'React' } },
      { label: { ru: 'Таблицы', en: 'Tables' }, note: { ru: 'AG Grid', en: 'AG Grid' } },
      {
        label: { ru: 'Сохранение состояния', en: 'State saving' },
        note: { ru: 'версии и синхронизация', en: 'versions and sync' },
      },
      { label: 'API' },
    ],
    nda: true,
    hue: 250,
    featured: true,
  },
  {
    slug: 'telegram-bots',
    title: 'Telegram-боты и mini app',
    category: 'bots',
    ru: 'Сеть внутренних ботов и mini app, которые автоматизируют рабочие процессы компании.',
    en: 'A network of in-house bots and a mini app that automate the company’s working processes.',
    long: {
      ru: 'Внутренние Telegram-боты и mini app компании. Они автоматизируют рабочие процессы: работу с данными в Google Sheets, отчётность и рутинные операции через скрипты и интеграции. Я разрабатывал и поддерживаю ботов, настраивал интеграции, а для пользователей написал инструкции в Notion.',
      en: 'The company’s in-house Telegram bots and a mini app. They automate working processes: handling data in Google Sheets, reporting and routine operations through scripts and integrations. I built and maintain the bots, set up the integrations and wrote the user guides in Notion.',
    },
    role: { ru: 'Разработка и поддержка', en: 'Development and support' },
    year: '2025',
    tech: ['Telegram Bot API', 'Google Sheets', 'Apps Script', 'Notion'],
    arch: [
      { label: 'Telegram' },
      { label: { ru: 'Боты и mini app', en: 'Bots and mini app' } },
      { label: { ru: 'Скрипты и интеграции', en: 'Scripts and integrations' } },
      { label: 'Google Sheets' },
    ],
    nda: true,
    hue: 205,
    featured: true,
  },
  {
    slug: 'portfolio-site',
    title: 'Personal Portfolio',
    category: 'web',
    ru: 'Этот сайт: многостраничное портфолио на двух языках с тестами и быстрой загрузкой.',
    en: 'This site: a multi-page bilingual portfolio with tests and fast loading.',
    long: {
      ru: 'Личный сайт, который вы сейчас смотрите. Vue 3, TypeScript и Vite, свой CSS без библиотек. Несколько страниц, две языковые версии (русский и английский), заставка, ленивая загрузка картинок, доступность и проверки: unit-тесты на Vitest, сквозные на Playwright, замеры Lighthouse. Публикуется на GitHub Pages через GitHub Actions. Собирал вместе с ИИ-агентом и учился на ходу.',
      en: 'The personal site you are looking at. Vue 3, TypeScript and Vite with hand-written CSS and no UI libraries. Several pages, two languages (Russian and English), a preloader, lazy image loading, accessibility and checks: unit tests on Vitest, end-to-end tests on Playwright, Lighthouse audits. Published to GitHub Pages through GitHub Actions. Built together with an AI agent, learning on the way.',
    },
    role: { ru: 'Дизайн, вёрстка и разработка', en: 'Design, markup and development' },
    year: '2026',
    tech: ['Vue 3', 'TypeScript', 'Vite', 'Vitest', 'Playwright'],
    arch: [
      { label: 'Vue 3 + Router' },
      { label: 'Vite', note: { ru: 'сборка', en: 'build' } },
      { label: 'GitHub Actions' },
      { label: 'GitHub Pages' },
    ],
    repo: 'https://github.com/User1234-Code-maker/portfolio',
    demo: 'https://user1234-code-maker.github.io/portfolio/',
    cover: coverPortfolio,
    shots: [shot1, shot2, shot3],
    hue: 262,
  },
]

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug)

export const categoryOf = (c: Category) => `cat_${c}`

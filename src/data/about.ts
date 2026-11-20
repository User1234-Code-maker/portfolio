import type { Job, Milestone, Service, SkillGroup } from './types'

export const stackIcons = ['TypeScript', 'React', 'Vue', 'Node.js', 'PostgreSQL', 'Prisma', 'Redis', 'Git']

export const skills: SkillGroup[] = [
  {
    name: { ru: 'Фронтенд', en: 'Frontend' },
    items: ['React 19', 'Vue 3', 'TypeScript', 'Tailwind v4', 'HeroUI', 'AG Grid'],
  },
  {
    name: { ru: 'Бэкенд и данные', en: 'Backend & data' },
    items: ['Node.js', 'PostgreSQL', 'Telegram Bot API', 'Google Sheets / Apps Script'],
  },
  {
    name: { ru: 'Аналитика', en: 'Analysis' },
    items: [
      { ru: 'Системный анализ', en: 'Systems analysis' },
      'BRD',
      'User stories',
      { ru: 'Спецификации API', en: 'API specs' },
      'BPMN',
      'Code review',
    ],
  },
  {
    name: { ru: 'Продажи и переговоры', en: 'Sales & negotiation' },
    items: [
      { ru: 'B2B-продажи IT и ИИ', en: 'B2B IT & AI sales' },
      { ru: 'Пресейл', en: 'Pre-sale' },
      { ru: 'Коммерческие предложения', en: 'Commercial proposals' },
      { ru: 'Переговоры с ЛПР', en: 'C-level negotiations' },
    ],
  },
  {
    name: { ru: 'Инструменты', en: 'Tools' },
    items: [
      'Git',
      'GitHub Actions',
      'Cursor',
      'Playwright',
      'Vitest',
      'Notion',
      'Figma',
      { ru: 'ИИ-агенты', en: 'AI agents' },
    ],
  },
  {
    name: { ru: 'Языки', en: 'Languages' },
    items: [
      { ru: 'Русский: родной', en: 'Russian: native' },
      { ru: 'Английский: B2', en: 'English: B2' },
      { ru: 'Японский: JLPT N5', en: 'Japanese: JLPT N5' },
    ],
  },
]

export const jobs: Job[] = [
  {
    period: { ru: 'Апрель 2025 — по настоящее время', en: 'Apr 2025 — present' },
    role: { ru: 'Системный аналитик, fullstack-разработчик', en: 'Systems analyst, fullstack developer' },
    company: { ru: 'Zero to Infinity (музыкальный лейбл)', en: 'Zero to Infinity (music label)' },
    text: {
      ru: 'Собираю требования и пишу документацию (BRD, user stories, спецификации API). Участвую в разработке модулей ERP, делаю Telegram-ботов и автоматизацию на скриптах. Довёл до релиза сохранение состояния таблиц в ERP.',
      en: 'I gather requirements and write documentation (BRD, user stories, API specs). I help build ERP modules, make Telegram bots and script-based automation. I took table state saving in the ERP all the way to release.',
    },
  },
  {
    period: { ru: 'Июнь 2025 — март 2026', en: 'Jun 2025 — Mar 2026' },
    role: { ru: 'Business Development Manager (IT и ИИ)', en: 'Business Development Manager (IT & AI)' },
    company: { ru: 'Quantum Agency', en: 'Quantum Agency' },
    text: {
      ru: 'Холодные B2B-продажи IT- и ИИ-решений, аутсорса и аутстаффа. Вёл сделки от первого контакта до договора, закрывал сделки до 15 млн ₽.',
      en: 'Cold B2B sales of IT and AI solutions, outsourcing and outstaffing. I ran deals from first contact to contract and closed deals worth up to 15M RUB.',
    },
  },
  {
    period: { ru: 'Январь 2024 — июнь 2025', en: 'Jan 2024 — Jun 2025' },
    role: { ru: 'IT Sales Manager', en: 'IT Sales Manager' },
    company: { ru: 'Nomadic Soft', en: 'Nomadic Soft' },
    text: {
      ru: 'Проектные продажи в web, mobile и AI: сбор требований, пресейл, коммерческие предложения вместе с разработкой. Закрывал проекты до 10 млн ₽.',
      en: 'Project sales in web, mobile and AI: requirements, pre-sale and commercial proposals together with the dev team. I closed projects worth up to 10M RUB.',
    },
  },
  {
    period: { ru: 'Октябрь 2022 — июнь 2025', en: 'Oct 2022 — Jun 2025' },
    role: { ru: 'Основатель и независимый IT-консультант', en: 'Founder & independent IT consultant' },
    company: { ru: 'Собственные проекты, фриланс', en: 'Own projects, freelance' },
    text: {
      ru: 'Запускал свои IT- и digital-проекты без внешнего финансирования, собрал распределённую команду. Внедрял ИИ и скрипты для автоматизации продаж и отчётности.',
      en: 'Launched my own IT and digital projects without external funding and built a distributed team. Used AI and scripts to automate sales and reporting.',
    },
  },
]

export const services: Service[] = [
  {
    title: { ru: 'Интерфейсы', en: 'Interfaces' },
    text: {
      ru: 'Аккуратная вёрстка и фронтенд на Vue и React.',
      en: 'Clean markup and frontend in Vue and React.',
    },
  },
  {
    title: { ru: 'Серверная часть', en: 'Backend' },
    text: {
      ru: 'API, базы данных, интеграции и платежи.',
      en: 'APIs, databases, integrations and payments.',
    },
  },
  {
    title: { ru: 'Системный анализ', en: 'Systems analysis' },
    text: {
      ru: 'Разбираю сложные системы и описываю их понятно.',
      en: 'Breaking down complex systems and documenting them clearly.',
    },
  },
  {
    title: { ru: 'Музыка', en: 'Music' },
    text: { ru: 'Пишу и выпускаю треки сам.', en: 'Writing and releasing tracks myself.' },
  },
]

/** Таймлайн: этапы из резюме */
export const milestones: Milestone[] = [
  {
    year: '2022',
    title: { ru: 'Свои IT-проекты', en: 'Own IT projects' },
    text: {
      ru: 'Начал собственные IT- и digital-проекты и собрал распределённую команду.',
      en: 'Started my own IT and digital projects and built a distributed team.',
    },
  },
  {
    year: '2024',
    title: { ru: 'Продажи IT-решений', en: 'Selling IT solutions' },
    text: {
      ru: 'Проектные продажи в web, mobile и AI: учился говорить на языке и бизнеса, и разработчиков.',
      en: 'Project sales in web, mobile and AI: learning to speak the language of both business and developers.',
    },
  },
  {
    year: '2025',
    title: { ru: 'Аналитика и разработка', en: 'Analysis and development' },
    text: {
      ru: 'Системный аналитик и fullstack-разработчик в лейбле: ERP, боты, документация. Параллельно вёл B2B-продажи IT и ИИ.',
      en: 'Systems analyst and fullstack developer at a label: ERP, bots, documentation. Ran B2B IT and AI sales alongside.',
    },
  },
  {
    year: '2026',
    title: { ru: 'Альбом 1234 и это портфолио', en: 'The 1234 album and this portfolio' },
    text: {
      ru: 'Вышел дебютный альбом 1234 и несколько синглов. Собрал личный сайт вместе с ИИ-агентом.',
      en: 'My debut album 1234 and a few singles came out. I built this personal site together with an AI agent.',
    },
  },
]

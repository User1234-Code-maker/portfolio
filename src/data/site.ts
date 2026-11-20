/* ─────────────────────────────────────────────────────────────
   ЕДИНАЯ ТОЧКА ДАННЫХ
   Контакты лежат здесь, остальное в соседних файлах:
   projects.ts, music.ts, about.ts, texts.ts
   ───────────────────────────────────────────────────────────── */
import { jobs, services, skills } from './about'
import { releases } from './music'
import { projects } from './projects'
import { texts } from './texts'
import type { Contacts, Lang } from './types'

export type { Lang } from './types'

const contacts: Contacts = {
  email: 'bogdan.korzun2003@gmail.com',
  github: 'https://github.com/User1234-Code-maker',
  linkedin: 'https://www.linkedin.com/in/bogdankorzun/',
  telegram: 'https://t.me/OpalineDream',
  whatsapp: 'https://wa.me/79241181324',
  soundcloud: 'https://soundcloud.com/user1234user1234user1234',
}

export const site = {
  contacts,
  projects,
  skills,
  releases,
  jobs,
  services,
  t: texts as Record<Lang, Record<string, string>>,
}

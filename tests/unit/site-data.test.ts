import { describe, expect, it } from 'vitest'
import { site } from '../../src/data/site'
import { categories, projects } from '../../src/data/projects'
import { releases } from '../../src/data/music'

describe('данные сайта', () => {
  it('у русской и английской версий одинаковые ключи текстов', () => {
    expect(Object.keys(site.t.ru).sort()).toEqual(Object.keys(site.t.en).sort())
  })
  it('нет пустых текстов', () => {
    for (const lang of ['ru', 'en'] as const) {
      for (const [key, value] of Object.entries(site.t[lang])) {
        expect(value.trim(), `${lang}.${key}`).not.toBe('')
      }
    }
  })
  it('у каждой категории есть название и хотя бы один проект', () => {
    for (const c of categories) {
      expect(site.t.ru[`cat_${c}`], c).toBeTruthy()
      expect(
        projects.some((p) => p.category === c),
        c,
      ).toBe(true)
    }
  })
  it('у проектов уникальные slug, описания, стек и схема', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length)
    for (const p of projects) {
      expect(p.title).toBeTruthy()
      expect(p.ru).toBeTruthy()
      expect(p.en).toBeTruthy()
      expect(p.tech.length).toBeGreaterThan(0)
      expect(p.arch.length).toBeGreaterThan(1)
      expect(categories).toContain(p.category)
    }
  })
  it('проекты под NDA и демонстрационные без ссылок, остальные со ссылкой', () => {
    for (const p of projects) {
      if (p.sample || p.nda) {
        expect(p.repo).toBeUndefined()
        expect(p.demo).toBeUndefined()
      } else {
        expect(p.repo || p.demo).toBeTruthy()
      }
    }
  })
  it('релизы: уникальные id, треки, корректные даты и формат длины', () => {
    expect(new Set(releases.map((r) => r.id)).size).toBe(releases.length)
    for (const r of releases) {
      expect(Number.isNaN(Date.parse(r.date)), r.id).toBe(false)
      expect(r.tracks.length).toBeGreaterThan(0)
      for (const t of r.tracks) if (t.length) expect(t.length).toMatch(/^\d+:\d{2}$/)
    }
  })
  it('все контакты заполнены (ссылка на SoundCloud не заглушка)', () => {
    for (const [key, value] of Object.entries(site.contacts)) {
      expect(value, key).toBeTruthy()
      expect(value, key).not.toBe('#')
    }
  })
})

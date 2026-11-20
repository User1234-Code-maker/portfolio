/* ─────────────────────────────────────────────────────────────
   МУЗЫКА. Настоящие релизы User1234.
   Даты и названия сверены с карточками на Apple Music и Deezer.
   Если даты нет (только год), пишем '2026': сайт покажет год.
   Обложки лежат в src/assets/img; нет файла: рисуется заглушка.
   ───────────────────────────────────────────────────────────── */
import type { Release } from './types'
import album from '../assets/img/cover-album-1234.webp'
import albumSm from '../assets/img/cover-album-1234-sm.webp'
import ppxvl from '../assets/img/cover-single-ppxvl.webp'
import ppxvlSm from '../assets/img/cover-single-ppxvl-sm.webp'
import yaVAd from '../assets/img/cover-single-ya-v-ad.webp'
import yaVAdSm from '../assets/img/cover-single-ya-v-ad-sm.webp'
import yaTebya from '../assets/img/cover-single-ya-tebya-lyublyu.webp'
import yaTebyaSm from '../assets/img/cover-single-ya-tebya-lyublyu-sm.webp'

export const artistName = 'User1234'

export const releases: Release[] = [
  {
    id: 'ya-tebya-lyublyu',
    cover: yaTebya,
    coverSm: yaTebyaSm,
    title: 'Я тебя люблю',
    kind: 'single',
    date: '2026-09-25',
    genres: ['Alternative'],
    hue: 262,
    sample: false,
    tracks: [{ title: 'Я тебя люблю', length: '2:24', src: 'audio/ya-tebya-lyublyu/ya-tebya-lyublyu.mp3' }],
    links: [
      {
        name: 'Apple Music',
        url: 'https://music.apple.com/th/album/%D1%8F-%D1%82%D0%B5%D0%B1%D1%8F-%D0%BB%D1%8E%D0%B1%D0%BB%D1%8E-single/6814802167',
      },
    ],
  },
  {
    id: 'ya-v-ad',
    cover: yaVAd,
    coverSm: yaVAdSm,
    title: 'Я в ад',
    kind: 'single',
    date: '2026-06-02',
    genres: ['Punk', 'Post-punk'],
    hue: 232,
    sample: false,
    tracks: [{ title: 'Я в ад', length: '2:38', src: 'audio/ya-v-ad/ya-v-ad.mp3' }],
    blurb: {
      ru: 'Первый сольный трек после альбома. Злой, честный и немного смешной: про день, когда всё идёт не так и уже не хочется сопротивляться.',
      en: 'The first solo track after the album. Angry, honest and a little funny: about a day when everything goes wrong and you stop fighting it.',
    },
    links: [
      {
        name: 'Apple Music',
        url: 'https://music.apple.com/th/album/%D1%8F-%D0%B2-%D0%B0%D0%B4-single/6819212286',
      },
      { name: 'Deezer', url: 'https://www.deezer.com/tr/artist/352405532' },
    ],
  },
  {
    id: 'ppxvl',
    title: 'ППХВЛ',
    kind: 'single',
    date: '2026',
    genres: ['Alternative'],
    hue: 248,
    sample: false,
    cover: ppxvl,
    coverSm: ppxvlSm,
    tracks: [{ title: 'ППХВЛ', length: '4:20', src: 'audio/ppxvl/ppxvl.mp3' }],
    links: [
      {
        name: 'Apple Music',
        url: 'https://music.apple.com/th/album/%D0%BF%D0%BF%D1%85%D0%B2%D0%BB-single/6819720950',
      },
    ],
  },
  {
    id: 'album-1234',
    title: '1234',
    kind: 'album',
    date: '2026-03-13',
    genres: ['Alternative rock', 'Pop-punk', 'Electronic'],
    hue: 205,
    sample: false,
    cover: album,
    coverSm: albumSm,
    blurb: {
      ru: 'Концептуальный дебютный альбом о герое и целом поколении: путь от тревоги и одиночества к принятию. Альтернативный рок, поп-панк и клубная электроника.',
      en: 'A concept debut album about one hero and a whole generation: a path from anxiety and loneliness to acceptance. Alternative rock, pop-punk and club electronics.',
    },
    tracks: [
      { title: '13.09.2025', length: '1:04', src: 'audio/album-1234/01-13-09-2025.mp3' },
      { title: 'Халат', length: '2:40', src: 'audio/album-1234/02-halat.mp3' },
      { title: 'МИРСИ СЕК', length: '3:20', src: 'audio/album-1234/03-mirsi-sek.mp3' },
      { title: 'Малышка не умеет плавать', length: '2:48', src: 'audio/album-1234/04-malyshka.mp3' },
      { title: 'Обложка', length: '2:40', src: 'audio/album-1234/05-oblozhka.mp3' },
      { title: '7 сердец', length: '2:28', src: 'audio/album-1234/06-7-serdec.mp3' },
      { title: 'ДЕТКА', length: '2:51', src: 'audio/album-1234/07-detka.mp3' },
      { title: 'Очень грустная песня', length: '3:54', src: 'audio/album-1234/08-ochen-grustnaya.mp3' },
      { title: 'GO HARD!', length: '3:36', src: 'audio/album-1234/09-go-hard.mp3' },
      { title: 'ЦУНАМИ-ЗОМБИ', length: '2:57', src: 'audio/album-1234/10-tsunami-zombi.mp3' },
    ],
    links: [
      { name: 'Apple Music', url: 'https://music.apple.com/th/album/1234/6819652089' },
      { name: 'Deezer', url: 'https://www.deezer.com/en/album/1114875932' },
      { name: 'Audiomack', url: 'https://audiomack.com/user1234-6ab266d721304/album/1234' },
    ],
  },
]

/** Названия жанров по-русски (в данных они хранятся по-английски) */
const genreRu: Record<string, string> = {
  Alternative: 'Альтернатива',
  'Alternative rock': 'Альтернативный рок',
  'Pop-punk': 'Поп-панк',
  Electronic: 'Электроника',
  Punk: 'Панк',
  'Post-punk': 'Пост-панк',
}
export const genreLabel = (g: string, lang: 'ru' | 'en') => (lang === 'ru' ? (genreRu[g] ?? g) : g)

/** Страницы артиста на площадках */
export const platforms = [
  { name: { ru: 'Spotify', en: 'Spotify' }, url: 'https://open.spotify.com/artist/0XjvS7lUsuVhAtp8XIov8n' },
  {
    name: { ru: 'Apple Music', en: 'Apple Music' },
    url: 'https://music.apple.com/th/artist/user1234/1848050454',
  },
  { name: { ru: 'Яндекс Музыка', en: 'Yandex Music' }, url: 'https://music.yandex.com/artist/24921924' },
  { name: { ru: 'VK Музыка', en: 'VK Music' }, url: 'https://vk.com/artist/user1234' },
  { name: { ru: 'YouTube', en: 'YouTube' }, url: 'https://www.youtube.com/@BogdanKorzun' },
  { name: { ru: 'Deezer', en: 'Deezer' }, url: 'https://www.deezer.com/tr/artist/352405532' },
]

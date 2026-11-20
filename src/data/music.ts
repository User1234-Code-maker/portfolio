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

export const artistName = 'User1234'

export const releases: Release[] = [
  {
    id: 'ya-tebya-lyublyu',
    title: 'Я тебя люблю',
    kind: 'single',
    date: '2026-09-25',
    genres: ['Alternative'],
    hue: 262,
    sample: false,
    tracks: [{ title: 'Я тебя люблю', length: '2:24' }],
    links: [
      {
        name: 'Apple Music',
        url: 'https://music.apple.com/th/album/%D1%8F-%D1%82%D0%B5%D0%B1%D1%8F-%D0%BB%D1%8E%D0%B1%D0%BB%D1%8E-single/6814802167',
      },
    ],
  },
  {
    id: 'ya-v-ad',
    title: 'Я в ад',
    kind: 'single',
    date: '2026-06-02',
    genres: ['Punk', 'Post-punk'],
    hue: 232,
    sample: false,
    tracks: [{ title: 'Я в ад', length: '2:38' }],
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
    tracks: [{ title: 'ППХВЛ' }],
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
      { title: '13.09.2025', length: '1:04' },
      { title: 'Халат', length: '2:40' },
      { title: 'МИРСИ СЕК', length: '3:20' },
      { title: 'Малышка не умеет плавать', length: '2:48' },
      { title: 'Обложка', length: '2:40' },
      { title: '7 сердец', length: '2:28' },
      { title: 'ДЕТКА', length: '2:51' },
      { title: 'Очень грустная песня', length: '3:54' },
      { title: 'GO HARD!', length: '3:36' },
      { title: 'ЦУНАМИ-ЗОМБИ', length: '2:57' },
    ],
    links: [
      { name: 'Apple Music', url: 'https://music.apple.com/th/album/1234/6819652089' },
      { name: 'Deezer', url: 'https://www.deezer.com/en/album/1114875932' },
      { name: 'Audiomack', url: 'https://audiomack.com/user1234-6ab266d721304/album/1234' },
    ],
  },
]

/** Страницы артиста на площадках */
export const platforms = [
  { name: 'Spotify', url: 'https://open.spotify.com/artist/0XjvS7lUsuVhAtp8XIov8n' },
  { name: 'Apple Music', url: 'https://music.apple.com/th/artist/user1234/1848050454' },
  { name: 'Яндекс Музыка', url: 'https://music.yandex.com/artist/24921924' },
  { name: 'VK Музыка', url: 'https://vk.com/artist/user1234' },
  { name: 'YouTube', url: 'https://www.youtube.com/@BogdanKorzun' },
  { name: 'Deezer', url: 'https://www.deezer.com/tr/artist/352405532' },
]

/** SoundCloud: профиль для встроенного плеера */
export const soundcloudProfile = 'https://soundcloud.com/user1234user1234user1234'

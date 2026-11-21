<script setup lang="ts">
import { computed, ref } from 'vue'
import PageShell from '../components/PageShell.vue'
import SceneEyebrow from '../components/SceneEyebrow.vue'
import UiIcon from '../components/UiIcon.vue'
import TrackWave from '../components/TrackWave.vue'
import { useLang } from '../composables/useLang'
import { toggle, usePlayer } from '../composables/usePlayer'
import { jobs, milestones, services, skills } from '../data/about'
import { releases } from '../data/music'
import { tx } from '../utils/i18n'
import { vReveal } from '../directives/reveal'
import charSm from '../assets/img/character-sm.webp'
import chr from '../assets/img/character.webp'
import icTs from '../assets/img/ic-ts.webp'
import icReact from '../assets/img/ic-react.webp'
import icNode from '../assets/img/ic-node.webp'
import icPg from '../assets/img/ic-pg.webp'
import icPrisma from '../assets/img/ic-prisma.webp'
import icRedis from '../assets/img/ic-redis.webp'

const { lang, t } = useLang()

const cvHref = computed(
  () => `${import.meta.env.BASE_URL}cv/Bogdan-Korzun-CV-${lang.value === 'ru' ? 'RU' : 'EN'}.pdf`,
)
const stack = [
  { name: 'TypeScript', src: icTs },
  { name: 'React', src: icReact },
  { name: 'Node.js', src: icNode },
  { name: 'PostgreSQL', src: icPg },
  { name: 'Prisma', src: icPrisma },
  { name: 'Redis', src: icRedis },
]
const serviceIcons = ['code', 'layers', 'grid', 'note'] as const

// путь: открыт последний этап
const step = ref(milestones.length - 1)
// навыки: выбранная группа
const group = ref(0)

// мини-плеер альбома прямо на странице
const album = releases.find((r) => r.kind === 'album') ?? releases[0]!
const player = usePlayer()
const albumPlaying = computed(() => player.release?.id === album.id && player.playing)
const playAlbum = () => toggle(album, player.release?.id === album.id ? player.index : 0)
</script>

<template>
  <PageShell name="about" jp="自己紹介">
    <template #hero>
      <SceneEyebrow :text="t('eyebrow')" />
      <h1 class="sc-title">{{ t('a_hi') }}</h1>
      <p class="sc-lead">{{ t('a_role') }}</p>
      <div class="sc-actions">
        <a class="pill cv-btn" :href="cvHref" download
          >{{ t('a_cv') }} <UiIcon name="download" :size="18"
        /></a>
        <span class="avail"><i></i>{{ t('a_open') }}</span>
      </div>
    </template>
    <template #art>
      <div class="ab-art">
        <span class="ab-halo" aria-hidden="true"></span>
        <picture>
          <source media="(max-width: 700px)" :srcset="charSm" />
          <img class="ab-char" :src="chr" alt="" width="2664" height="1872" fetchpriority="high" />
        </picture>
        <div class="ab-now glass">
          <small>{{ t('a_now') }}</small>
          <b>{{ jobs[0]!.company[lang] }}</b>
          <span>{{ jobs[0]!.role[lang] }}</span>
        </div>
      </div>
    </template>

    <!-- кто я: крупный текст и две стороны -->
    <section class="wrap blk ab-story" aria-labelledby="story-t">
      <div v-reveal class="ab-story-text">
        <h2 id="story-t" class="blk-kicker">{{ t('a_story_t') }}</h2>
        <p class="ab-big">{{ t('a_text') }}</p>
      </div>
      <div class="ab-sides stagger">
        <RouterLink v-reveal to="/projects" class="side-card glass" style="--i: 0">
          <span class="side-ic"><UiIcon name="code" :size="26" /></span>
          <h3>{{ t('a_dev_t') }}</h3>
          <p>{{ t('a_dev_p') }}</p>
          <span class="side-go">{{ t('p_title') }} <UiIcon name="arrow" :size="18" /></span>
        </RouterLink>
        <RouterLink v-reveal to="/music" class="side-card glass alt" style="--i: 1">
          <span class="side-ic"><UiIcon name="note" :size="26" /></span>
          <h3>{{ t('a_music_t') }}</h3>
          <p>{{ t('a_music_p') }}</p>
          <span class="side-go">{{ t('m_title') }} <UiIcon name="arrow" :size="18" /></span>
        </RouterLink>
      </div>
    </section>

    <!-- путь: горизонтальная шкала, этапы кликабельны -->
    <section v-reveal class="wrap blk" aria-labelledby="path-t">
      <h2 id="path-t" class="blk-h">{{ t('a_tl_t') }}</h2>
      <p class="blk-hint">{{ t('a_tl_hint') }}</p>
      <div class="path" :style="{ '--fill': (step + 0.5) / milestones.length }">
        <div class="path-track" aria-hidden="true"><i></i></div>
        <div class="path-steps" role="tablist" :aria-label="t('a_tl_t')">
          <button
            v-for="(m, i) in milestones"
            :id="`ms-tab-${i}`"
            :key="m.year"
            type="button"
            role="tab"
            :class="{ on: step === i, past: i < step }"
            :aria-selected="step === i"
            aria-controls="ms-panel"
            @click="step = i"
          >
            <span class="path-dot" aria-hidden="true"></span>
            <span class="path-year">{{ m.year }}</span>
            <span class="path-title">{{ m.title[lang] }}</span>
          </button>
        </div>
        <Transition name="swap" mode="out-in">
          <div
            id="ms-panel"
            :key="step"
            class="path-panel glass"
            role="tabpanel"
            :aria-labelledby="`ms-tab-${step}`"
          >
            <span class="path-panel-y" aria-hidden="true">{{ milestones[step]!.year }}</span>
            <div>
              <h3>{{ milestones[step]!.title[lang] }}</h3>
              <p>{{ milestones[step]!.text[lang] }}</p>
            </div>
          </div>
        </Transition>
      </div>
    </section>

    <!-- технологии и навыки -->
    <section v-reveal class="wrap blk" aria-labelledby="skills-t">
      <div class="ab-skills-head">
        <h2 id="skills-t" class="blk-h">{{ t('a_skills_t') }}</h2>
        <ul class="tech-tiles stagger" :aria-label="t('a_stack_t')">
          <li v-for="(s, i) in stack" :key="s.name" class="tech-tile" :style="{ '--i': i }">
            <img :src="s.src" :alt="s.name" width="34" height="34" loading="lazy" decoding="async" />
            <span>{{ s.name }}</span>
          </li>
        </ul>
      </div>
      <div class="skills-board glass">
        <div class="skill-tabs" role="tablist" :aria-label="t('a_skills_t')">
          <button
            v-for="(g, i) in skills"
            :id="`sk-tab-${i}`"
            :key="g.name.en"
            type="button"
            role="tab"
            :aria-selected="group === i"
            aria-controls="sk-panel"
            :class="{ on: group === i }"
            @click="group = i"
          >
            {{ g.name[lang] }}<small>{{ g.items.length }}</small>
          </button>
        </div>
        <Transition name="swap" mode="out-in">
          <div
            id="sk-panel"
            :key="group"
            class="skill-panel"
            role="tabpanel"
            :aria-labelledby="`sk-tab-${group}`"
          >
            <ul class="skill-chips">
              <li v-for="(item, i) in skills[group]!.items" :key="tx(item, 'en')" :style="{ '--i': i }">
                {{ tx(item, lang) }}
              </li>
            </ul>
          </div>
        </Transition>
      </div>

      <h3 class="blk-sub">{{ t('a_do') }}</h3>
      <ul class="services-row stagger">
        <li v-for="(s, i) in services" :key="s.title.en" class="service-card" :style="{ '--i': i }">
          <span class="service-ic"><UiIcon :name="serviceIcons[i] ?? 'spark'" :size="22" /></span>
          <h4>{{ s.title[lang] }}</h4>
          <p>{{ s.text[lang] }}</p>
        </li>
      </ul>
    </section>

    <!-- опыт: вертикальная линия, которая «дорисовывается» при прокрутке -->
    <section class="wrap blk" aria-labelledby="exp-t">
      <h2 id="exp-t" v-reveal class="blk-h">{{ t('a_exp_t') }}</h2>
      <ol class="jobs">
        <li v-for="(j, i) in jobs" :key="j.period.en" v-reveal class="job" :style="{ '--i': i }">
          <time class="job-when">{{ j.period[lang] }}</time>
          <span class="job-dot" aria-hidden="true"></span>
          <div class="job-body">
            <h3>{{ j.role[lang] }}</h3>
            <p class="job-co">{{ j.company[lang] }}</p>
            <p>{{ j.text[lang] }}</p>
          </div>
        </li>
      </ol>
    </section>

    <!-- музыка: альбом можно включить прямо здесь -->
    <section v-reveal class="wrap blk" :aria-label="t('a_music_t')">
      <div class="ab-band glass">
        <img
          class="ab-band-cover"
          :src="album.coverSm ?? album.cover"
          alt=""
          width="160"
          height="160"
          loading="lazy"
          decoding="async"
        />
        <div class="ab-band-text">
          <h2>{{ t('a_band_t') }}</h2>
          <p>{{ t('a_band_p') }}</p>
        </div>
        <button
          type="button"
          class="play-round"
          :aria-label="albumPlaying ? t('np_pause') : t('np_play_album')"
          @click="playAlbum"
        >
          <UiIcon :name="albumPlaying ? 'pause' : 'play'" :size="22" />
        </button>
        <TrackWave class="ab-band-wave" :playing="albumPlaying" :bars="56" />
      </div>
    </section>
  </PageShell>
</template>

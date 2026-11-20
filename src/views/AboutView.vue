<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHead from '../components/PageHead.vue'
import PageShell from '../components/PageShell.vue'
import { useLang } from '../composables/useLang'
import { jobs, milestones, services, skills } from '../data/about'
import { tx } from '../utils/i18n'
import { vReveal } from '../directives/reveal'
import { vTilt } from '../directives/tilt'
import charSm from '../assets/img/character-sm.webp'
import chr from '../assets/img/character.webp'
import icTs from '../assets/img/ic-ts.webp'
import icReact from '../assets/img/ic-react.webp'
import icNode from '../assets/img/ic-node.webp'
import icPg from '../assets/img/ic-pg.webp'
import icPrisma from '../assets/img/ic-prisma.webp'
import icRedis from '../assets/img/ic-redis.webp'

const { lang, t } = useLang()
const open = ref(milestones.length - 1)
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
</script>

<template>
  <PageShell>
    <PageHead :title="t('a_hi')" :lead="t('a_role')" jp="自己紹介" />

    <section class="wrap about-intro">
      <div v-reveal class="intro-text">
        <h2>{{ t('a_story_t') }}</h2>
        <p>{{ t('a_text') }}</p>
        <span class="avail"
          ><i></i><span>{{ t('a_open') }}</span></span
        >
        <a class="pill big cv-btn" :href="cvHref" download
          >{{ t('a_cv') }} <span aria-hidden="true">↓</span></a
        >
      </div>
      <div class="intro-art" aria-hidden="true">
        <span class="halo"></span>
        <picture>
          <source media="(max-width: 700px)" :srcset="charSm" />
          <img :src="chr" alt="" width="2664" height="1872" decoding="async" fetchpriority="low" />
        </picture>
      </div>
    </section>

    <section v-reveal class="wrap sec-tight duo" :aria-label="t('aria_duo')">
      <article v-tilt class="duo-card tilt">
        <span class="duo-ic" aria-hidden="true">{ }</span>
        <h3>{{ t('a_dev_t') }}</h3>
        <p>{{ t('a_dev_p') }}</p>
      </article>
      <article v-tilt class="duo-card tilt alt">
        <span class="duo-ic" aria-hidden="true">♪</span>
        <h3>{{ t('a_music_t') }}</h3>
        <p>{{ t('a_music_p') }}</p>
        <RouterLink class="slink" to="/music"
          ><span>{{ t('m_title') }}</span> <span aria-hidden="true">→</span></RouterLink
        >
      </article>
    </section>

    <section v-reveal class="wrap sec-tight" aria-labelledby="stack-t">
      <h2 id="stack-t" class="h2">{{ t('a_stack_t') }}</h2>
      <div class="stack-row stagger">
        <span v-for="(s, i) in stack" :key="s.name" class="stk" :style="{ '--i': i }">
          <img :src="s.src" :alt="s.name" height="34" loading="lazy" decoding="async" />
        </span>
      </div>
    </section>

    <section v-reveal class="wrap sec-tight" aria-labelledby="skills-t">
      <h2 id="skills-t" class="h2">{{ t('a_skills_t') }}</h2>
      <div class="skills stagger">
        <div v-for="(g, i) in skills" :key="g.name.en" v-tilt class="skill tilt" :style="{ '--i': i }">
          <h3>{{ g.name[lang] }}</h3>
          <ul>
            <li v-for="item in g.items" :key="tx(item, 'en')">{{ tx(item, lang) }}</li>
          </ul>
        </div>
      </div>
      <h3 class="sub-h">{{ t('a_do') }}</h3>
      <div class="services stagger">
        <div v-for="(s, i) in services" :key="s.title.en" v-tilt class="service tilt" :style="{ '--i': i }">
          <h4>{{ s.title[lang] }}</h4>
          <p>{{ s.text[lang] }}</p>
        </div>
      </div>
    </section>

    <section v-reveal class="wrap sec-tight" aria-labelledby="exp-t">
      <h2 id="exp-t" class="h2">{{ t('a_exp_t') }}</h2>
      <ol class="timeline stagger">
        <li v-for="(j, i) in jobs" :key="j.period.en" :style="{ '--i': i }">
          <span class="dot" aria-hidden="true"></span>
          <time class="period">{{ j.period[lang] }}</time>
          <h3>{{ j.role[lang] }}</h3>
          <p class="co">{{ j.company[lang] }}</p>
          <p>{{ j.text[lang] }}</p>
        </li>
      </ol>
    </section>

    <section v-reveal class="wrap sec-tight" aria-labelledby="tl-t">
      <h2 id="tl-t" class="h2">{{ t('a_tl_t') }}</h2>
      <p class="hint">{{ t('a_tl_hint') }}</p>
      <ol class="mtl" :style="{ '--fill': `${((open + 0.5) / milestones.length) * 100}%` }">
        <li v-for="(m, i) in milestones" :key="m.year" :class="{ open: open === i, passed: i <= open }">
          <button type="button" :aria-expanded="open === i" :aria-controls="`ms-${i}`" @click="open = i">
            <span class="my">{{ m.year }}</span>
            <span class="mt">{{ m.title[lang] }}</span>
          </button>
          <div :id="`ms-${i}`" class="mbody" role="region">
            <p>{{ m.text[lang] }}</p>
          </div>
        </li>
      </ol>
    </section>
  </PageShell>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLang } from '../composables/useLang'
import { hrefFor } from '../utils/links'
import BrandMark from './BrandMark.vue'
import LangSwitch from './LangSwitch.vue'
import SocialLinks from './SocialLinks.vue'
import ThemeToggle from './ThemeToggle.vue'

const { t } = useLang()
const route = useRoute()
const open = ref(false)

const links = [
  { to: '/about', key: 'nav_about' },
  { to: '/projects', key: 'nav_projects' },
  { to: '/music', key: 'nav_music' },
  { to: '/contact', key: 'nav_contact' },
]

// на главной, как в утверждённом макете, подчёркнут «Обо мне»
const isHome = computed(() => route.name === 'home')
const isOn = (to: string) =>
  isHome.value ? to === '/about' : route.path === to || route.path.startsWith(to + '/')

watch(
  () => route.fullPath,
  () => (open.value = false),
)
</script>

<template>
  <header :class="{ 'menu-open': open }">
    <RouterLink class="brand" to="/" :aria-label="`1234, ${t('nav_home')}`"><BrandMark />1234</RouterLink>
    <nav :aria-label="t('aria_main')">
      <RouterLink
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        :class="{ on: isOn(l.to) }"
        :aria-current="isOn(l.to) ? 'page' : undefined"
        >{{ t(l.key) }}</RouterLink
      >
    </nav>
    <div class="right">
      <SocialLinks />
      <ThemeToggle />
      <LangSwitch />
      <a class="pill" :href="hrefFor('mail')">{{ t('talk') }}</a>
      <button
        class="menu-btn"
        type="button"
        :aria-expanded="open"
        aria-controls="mobile-menu"
        :aria-label="t('menu')"
        @click="open = !open"
      >
        <span></span><span></span>
      </button>
    </div>
    <nav
      id="mobile-menu"
      class="mobile-menu"
      :aria-hidden="!open"
      :inert="!open"
      :aria-label="t('aria_menu')"
    >
      <RouterLink to="/" :class="{ on: isHome }">{{ t('nav_home') }}</RouterLink>
      <RouterLink v-for="l in links" :key="l.to" :to="l.to" :class="{ on: !isHome && isOn(l.to) }">{{
        t(l.key)
      }}</RouterLink>
      <div class="menu-contact">
        <a class="pill" :href="hrefFor('mail')">{{ t('talk') }}</a>
        <SocialLinks round />
      </div>
    </nav>
  </header>
</template>

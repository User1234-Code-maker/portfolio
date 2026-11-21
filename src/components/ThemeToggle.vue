<script setup lang="ts">
import { useLang } from '../composables/useLang'
import { useTheme } from '../composables/useTheme'

const { t } = useLang()
const { theme, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-btn"
    :class="theme"
    :aria-label="theme === 'dark' ? t('theme_light') : t('theme_dark')"
    :aria-pressed="theme === 'dark'"
    @click="toggle"
  >
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <g class="sun" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="4.2" />
        <path
          d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"
        />
      </g>
      <path class="moon" fill="currentColor" d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8Z" />
    </svg>
  </button>
</template>

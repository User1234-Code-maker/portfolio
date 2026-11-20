<script setup lang="ts">
import { useLang } from '../composables/useLang'
import BrandMark from './BrandMark.vue'
import SocialLinks from './SocialLinks.vue'

const { t } = useLang()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="wrap foot">
    <RouterLink class="brand" to="/" aria-label="1234"><BrandMark :size="26" />1234</RouterLink>
    <SocialLinks round class="foot-soc" />
    <span class="footmeta">
      <span>{{ t('foot') }}</span>
      <span>© {{ year }} Bogdan Korzun</span>
    </span>
  </footer>
</template>

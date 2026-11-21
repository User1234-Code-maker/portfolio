<script setup lang="ts">
import { vReveal } from '../directives/reveal'

// Заголовок внутренней страницы. Крупный, с японской подписью и маленькой кометой
defineProps<{ title: string; lead?: string; jp?: string }>()
</script>

<template>
  <header v-reveal class="wrap page-head">
    <span v-if="jp" class="ph-jp" aria-hidden="true">{{ jp }}</span>
    <h1>{{ title }}</h1>
    <p v-if="lead" class="lead">{{ lead }}</p>
    <slot />
  </header>
</template>

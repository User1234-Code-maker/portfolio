<script setup lang="ts">
import BrandMark from './BrandMark.vue'

// Подпись над заголовком страницы: талисман-шапочка вместо звёздочки
defineProps<{ text: string }>()
</script>

<template>
  <p class="sc-eyebrow"><BrandMark :size="22" />{{ text }}</p>
</template>

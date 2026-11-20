<script setup lang="ts">
defineProps<{ name: 'play' | 'pause' | 'next' | 'prev' | 'close' }>()
</script>

<template>
  <svg class="ico" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
    <path
      v-if="name === 'play'"
      d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"
    />
    <path v-else-if="name === 'pause'" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
    <path
      v-else-if="name === 'next'"
      d="M6 5.6v12.8a.8.8 0 0 0 1.2.7l8.6-6.4a.8.8 0 0 0 0-1.3L7.2 4.9A.8.8 0 0 0 6 5.6zM17 5h2.2v14H17z"
    />
    <path
      v-else-if="name === 'prev'"
      d="M18 5.6v12.8a.8.8 0 0 1-1.2.7l-8.6-6.4a.8.8 0 0 1 0-1.3l8.6-6.5a.8.8 0 0 1 1.2.7zM4.8 5H7v14H4.8z"
    />
    <path v-else class="st" d="M6.5 6.5l11 11m0-11-11 11" />
  </svg>
</template>

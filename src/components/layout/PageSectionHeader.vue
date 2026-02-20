<template>
  <section class="page-section-header">
    <h1 class="page-section-header__title">{{ title }}</h1>
    <p v-if="subtitle" class="page-section-header__subtitle">{{ subtitle }}</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

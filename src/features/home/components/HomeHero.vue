<template>
  <section class="home-hero">
    <h1 class="home-hero__title">{{ title }}</h1>
    <p class="home-hero__tagline">{{ tagline }}</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  tagline: string
}>()
</script>

<style scoped>
.home-hero {
  text-align: center;
  margin-bottom: 56px;
}

.home-hero__title {
  font-family: var(--fe-font-heading);
  font-size: 2.75rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--fe-text-primary);
  margin: 0 0 12px;
}

.home-hero__tagline {
  font-size: 1.25rem;
  color: var(--fe-text-secondary);
  margin: 0;
  font-weight: 400;
}

@media (max-width: 600px) {
  .home-hero {
    margin-bottom: 40px;
  }

  .home-hero__title {
    font-size: 2rem;
  }

  .home-hero__tagline {
    font-size: 1.1rem;
  }
}
</style>

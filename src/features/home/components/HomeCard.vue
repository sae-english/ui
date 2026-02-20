<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="home-card home-card--clickable"
  >
    <el-icon class="home-card__icon"><component :is="icon" /></el-icon>
    <h2 class="home-card__title">{{ title }}</h2>
    <p class="home-card__desc">{{ description }}</p>
    <el-icon class="home-card__arrow"><ArrowRight /></el-icon>
  </RouterLink>
  <div
    v-else
    class="home-card home-card--disabled"
  >
    <el-icon class="home-card__icon"><component :is="icon" /></el-icon>
    <h2 class="home-card__title">{{ title }}</h2>
    <p class="home-card__desc">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

defineProps<{
  title: string
  description: string
  icon: object
  to?: RouteLocationRaw | null
}>()
</script>

<style scoped>
.home-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid var(--fe-border);
  background: var(--fe-bg-card);
  text-decoration: none;
  color: inherit;
  transition:
    border-color var(--fe-transition-fast),
    background var(--fe-transition-fast),
    transform var(--fe-transition-fast),
    box-shadow var(--fe-transition-normal);
}

.home-card--clickable {
  cursor: pointer;
}

.home-card--clickable:hover {
  border-color: var(--fe-accent);
  background: var(--fe-bg-elevated);
  transform: translateY(-4px);
  box-shadow: var(--fe-shadow-lg);
}

.home-card--clickable:hover .home-card__title {
  color: var(--fe-accent);
}

.home-card--clickable:hover .home-card__arrow {
  transform: translateX(4px);
}

.home-card--disabled {
  opacity: 0.7;
  cursor: default;
}

.home-card__icon {
  font-size: 2rem;
  color: var(--fe-accent);
  margin-bottom: 16px;
}

.home-card__title {
  font-family: var(--fe-font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--fe-text-primary);
  margin: 0 0 8px;
  transition: color var(--fe-transition-fast);
}

.home-card__desc {
  font-size: 1rem;
  color: var(--fe-text-secondary);
  line-height: 1.5;
  margin: 0 0 20px;
  flex: 1;
}

.home-card__arrow {
  font-size: 1.25rem;
  color: var(--fe-accent);
  margin-top: auto;
  transition: transform var(--fe-transition-fast);
}

@media (max-width: 600px) {
  .home-card {
    padding: 24px;
  }
}
</style>

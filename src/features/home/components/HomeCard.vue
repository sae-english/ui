<template>
  <RouterLink v-if="to" :to="to" class="home-card-link">
    <el-card
      class="home-card home-card--clickable"
      shadow="hover"
      :body-style="{ padding: '24px 28px' }"
    >
      <el-icon class="home-card__icon"><component :is="icon" /></el-icon>
      <h2 class="home-card__title">{{ title }}</h2>
      <p class="home-card__desc">{{ description }}</p>
    </el-card>
  </RouterLink>
  <div v-else class="home-card-wrapper home-card-wrapper--disabled">
    <el-card
      class="home-card home-card--disabled"
      shadow="never"
      :body-style="{ padding: '24px 28px' }"
    >
      <el-icon class="home-card__icon"><component :is="icon" /></el-icon>
      <h2 class="home-card__title">{{ title }}</h2>
      <p class="home-card__desc">{{ description }}</p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElCard, ElIcon } from "element-plus";
import type { RouteLocationRaw } from "vue-router";

defineProps<{
  title: string;
  description: string;
  icon: object;
  to?: RouteLocationRaw | null;
}>();
</script>

<style scoped>
.home-card-link {
  display: block;
  text-decoration: none;
  height: 100%;
}

.home-card-wrapper {
  height: 100%;
}

.home-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  border-radius: 16px;
  border: 1px solid var(--fe-border);
  background: var(--fe-bg-card);
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

.home-card-wrapper--disabled {
  opacity: 0.7;
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
</style>

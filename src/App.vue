<template>
  <div class="app">
    <header class="app__header">
      <RouterLink :to="to('/')" class="app__logo">
        <el-icon class="app__logo-icon"><VideoCameraFilled /></el-icon>
        <span class="app__logo-text">English Movies</span>
      </RouterLink>
      <nav class="app__nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="to(item.path)"
          class="app__nav-link"
          :class="{ 'app__nav-link--active': isActive(item.path) }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="app__actions">
        <el-select
          :model-value="language"
          class="app__lang-select"
          size="default"
          @update:model-value="setLanguage"
        >
          <el-option
            v-for="opt in languageOptions"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </div>
    </header>
    <main class="app__main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { VideoCameraFilled } from "@element-plus/icons-vue";
import { useLanguage } from "@/composables/useLanguage";
import type { StudyLanguage } from "@/types/language";

const route = useRoute();
const { language, setLanguage, to, STUDY_LANGUAGE_LABELS } = useLanguage();

const navItems = [
  { path: "/", label: "Home" },
  { path: "/movies", label: "Movies" },
  { path: "/dictionary", label: "Dictionary" },
];

const languageOptions = computed(() =>
  Object.entries(STUDY_LANGUAGE_LABELS).map(([value, label]) => ({
    value: value as StudyLanguage,
    label,
  })),
);

function isActive(path: string): boolean {
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(path);
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app__header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 12px 24px;
  background: rgba(15, 18, 24, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--fe-border);
}

.app__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--fe-text-primary);
  text-decoration: none;
  font-family: var(--fe-font-heading);
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: -0.02em;
  transition: color var(--fe-transition-fast);
  flex-shrink: 0;
}

.app__logo:hover {
  color: var(--fe-accent);
}

.app__logo-icon {
  font-size: 1.5rem;
  color: var(--fe-accent);
}

.app__nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app__nav-link {
  padding: 8px 16px;
  color: var(--fe-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 8px;
  transition:
    color var(--fe-transition-fast),
    background var(--fe-transition-fast);
}

.app__nav-link:hover {
  color: var(--fe-text-primary);
  background: var(--fe-bg-elevated);
}

.app__nav-link--active {
  color: var(--fe-accent);
  background: var(--fe-accent-soft);
}

.app__nav-link--active:hover {
  color: var(--fe-accent);
}

.app__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.app__lang-select {
  width: 140px;
}

.app__lang-select :deep(.el-input__wrapper) {
  background: var(--fe-bg-elevated);
  border: 1px solid var(--fe-border);
  box-shadow: none;
}

.app__lang-select :deep(.el-input__wrapper:hover) {
  border-color: var(--fe-accent);
  background: var(--fe-bg-hover);
}

.app__main {
  flex: 1;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 600px) {
  .app__header {
    padding: 10px 20px;
    flex-wrap: wrap;
  }

  .app__logo-text {
    font-size: 1.1rem;
  }

  .app__nav {
    width: 100%;
    order: 3;
  }

  .app__nav-link {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}
</style>

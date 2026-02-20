<template>
  <div class="app">
    <AppHeader
      :language="language"
      :language-options="languageOptions"
      :nav-items="navItems"
      @update:language="setLanguage"
    />
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
import { useLanguage } from "@/composables/useLanguage";
import type { StudyLanguage } from "@/types/language";
import AppHeader from "@/components/layout/AppHeader.vue";

const { language, setLanguage, STUDY_LANGUAGE_LABELS } = useLanguage();

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
</script>

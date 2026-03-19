<template>
  <div class="app">
    <AppHeader
      :language="language"
      :language-options="languageOptions"
      :nav-items="navItems"
      :app-title="t.app.title"
      @update:language="setLanguage"
    />
    <main class="app__main">
      <div v-if="pageHeaderTitle" class="app__page-header-wrap">
        <PageSectionHeader
          :title="pageHeaderTitle"
          :subtitle="pageHeaderSubtitle || undefined"
        />
      </div>
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
import { useLanguage } from "@/composables/useLanguage";
import { useI18n } from "@/i18n";
import type { StudyLanguage } from "@/types/language";
import AppHeader from "@/components/layout/AppHeader.vue";
import PageSectionHeader from "@/components/layout/PageSectionHeader.vue";

const { language, setLanguage, STUDY_LANGUAGE_LABELS } = useLanguage();
const { t } = useI18n();
const route = useRoute();

const navItems = computed(() => [
  { path: "/movies", label: t.value.app.nav.movies },
  { path: "/series", label: t.value.app.nav.series },
  { path: "/comedy", label: t.value.app.nav.comedy },
  { path: "/books", label: t.value.app.nav.books },
  { path: "/dictionary", label: t.value.app.nav.dictionary },
]);

const languageOptions = computed(() =>
  Object.entries(STUDY_LANGUAGE_LABELS).map(([value, label]) => ({
    value: value as StudyLanguage,
    label,
  })),
);

function resolveI18nPath(obj: unknown, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return null;
  }, obj);
  return typeof value === "string" ? value : "";
}

const pageHeaderTitle = computed(() => {
  const key = route.meta.pageHeaderTitleKey;
  if (typeof key !== "string") return "";
  return resolveI18nPath(t.value, key);
});

const pageHeaderSubtitle = computed(() => {
  const key = route.meta.pageHeaderSubtitleKey;
  if (typeof key !== "string") return "";
  return resolveI18nPath(t.value, key);
});
</script>

<style scoped>
.app__page-header-wrap {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
</style>

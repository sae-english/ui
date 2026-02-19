<template>
  <el-container class="movie-content" direction="vertical">
    <el-header class="movie-content__header" height="auto">
      <el-button
        class="movie-content__back"
        :icon="ArrowLeftBold"
        text
        @click="goBack"
      >
        К фильмам
      </el-button>
    </el-header>

    <el-main class="movie-content__main">
      <el-space
        v-if="loading"
        direction="vertical"
        alignment="center"
        class="movie-content__loading"
      >
        <el-icon class="is-loading" :size="40"><VideoCameraFilled /></el-icon>
        <el-text type="info">Загрузка сценария...</el-text>
      </el-space>

      <el-empty v-else-if="error" :description="error">
        <el-button type="primary" @click="loadContent">Повторить</el-button>
      </el-empty>

      <template v-else-if="movieContent">
        <el-main class="movie-content__content">
          <EpisodeScript
            :blocks="blocks"
            @add-selection="handleBlockAddSelection"
          />
        </el-main>

        <PhraseDrawer
          v-model:visible="drawerVisible"
          :form="phraseForm"
          :loading="drawerSubmitting"
          :dictionary-context="drawerContext"
          @update:form="updatePhraseForm"
          @submit="handleDrawerSubmit"
        />
      </template>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ArrowLeftBold, VideoCameraFilled } from "@element-plus/icons-vue";
import { getMovieContentById, contentBlockToTranscriptBlock } from "@/features/movies/api";
import { useLanguage } from "@/composables/useLanguage";
import { saveDictionaryEntry } from "@/services/api";
import type { MovieDto } from "@/features/movies/types";
import type { PhraseFormModel } from "@/types/phrase";
import type { TranscriptBlock } from "@/types/movie";
import EpisodeScript from "@/components/script/EpisodeScript.vue";
import PhraseDrawer, { type DictionaryContext } from "@/components/script/PhraseDrawer.vue";

const route = useRoute();
const router = useRouter();
const { navQuery } = useLanguage();

const movieId = computed(() => {
  const id = route.params.movieId;
  return typeof id === "string" ? parseInt(id, 10) : Number(id);
});

const movie = ref<MovieDto | null>(null);
const movieContent = ref<Awaited<ReturnType<typeof getMovieContentById>>>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const blocks = computed<TranscriptBlock[]>(() => {
  const content = movieContent.value?.content;
  if (!Array.isArray(content)) return [];
  return content.map(contentBlockToTranscriptBlock);
});

const drawerVisible = ref(false);
const drawerPendingBlockId = ref<string | undefined>(undefined);
const drawerContext = computed(() => ({
  contentKey: movieContent.value?.contentKey ?? undefined,
  contentType: "MOVIE" as const,
  blockId: drawerPendingBlockId.value ?? undefined,
}));
const phraseForm = ref<PhraseFormModel>({
  phrase: "",
  translation: "",
  comment: "",
});
const drawerSubmitting = ref(false);

async function loadContent() {
  const id = movieId.value;
  if (!id || isNaN(id)) return;
  loading.value = true;
  error.value = null;
  try {
    const state = history.state as { movie?: MovieDto } | null;
    if (state?.movie) movie.value = state.movie;
    movieContent.value = await getMovieContentById(id);
    if (!movieContent.value) error.value = "Контент не найден";
  } catch (e) {
    console.error(e);
    error.value = "Не удалось загрузить сценарий";
    ElMessage.error(error.value);
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({
    name: "catalog",
    query: navQuery(),
  });
}

function handleBlockAddSelection(payload: { text: string; blockId?: string }) {
  phraseForm.value = { phrase: payload.text, translation: "", comment: "" };
  drawerPendingBlockId.value = payload.blockId;
  drawerVisible.value = true;
}

function updatePhraseForm(f: PhraseFormModel) {
  phraseForm.value = f;
}

async function handleDrawerSubmit(payload: {
  form: PhraseFormModel;
  context?: DictionaryContext | null;
}) {
  const { form, context } = payload;
  drawerSubmitting.value = true;
  try {
    await saveDictionaryEntry({
      value: form.phrase.trim(),
      translation: form.translation.trim(),
      comment: form.comment?.trim(),
      contentKey: context?.contentKey,
      contentType: context?.contentType as "MOVIE" | undefined,
      blockId: context?.blockId,
    });
    ElMessage.success("Добавлено в словарь");
    drawerVisible.value = false;
  } catch (e) {
    console.error(e);
    ElMessage.error("Не удалось сохранить");
  } finally {
    drawerSubmitting.value = false;
  }
}

onMounted(loadContent);
watch(movieId, loadContent);
</script>

<style scoped>
.movie-content {
  min-height: 100vh;
  padding: 24px 20px;
  background: var(--fe-bg-base);
  font-family: var(--fe-font-body);
}

.movie-content__header {
  padding: 0 !important;
  height: auto !important;
  margin-bottom: 24px;
}

.movie-content__back {
  color: var(--fe-text-secondary) !important;
}

.movie-content__back:hover {
  color: var(--fe-text-primary) !important;
}

.movie-content__loading {
  padding: 60px 24px;
}

.movie-content__content {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 !important;
}

</style>

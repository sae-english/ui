<template>
  <el-container class="movie-content" direction="vertical">
    <el-header class="movie-content__header" height="auto">
      <BackButton label="К фильмам" @click="goBack" />
    </el-header>

    <el-main class="movie-content__main">
      <div v-if="loading" class="content-loader-wrap">
        <ContentLoader message="Загрузка сценария..." />
      </div>

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
import { getMovieContentById, contentBlockToTranscriptBlock } from "@/features/movies/api";
import BackButton from "@/components/ui/BackButton.vue";
import { useLanguage } from "@/composables/useLanguage";
import { saveDictionaryEntry } from "@/services/api";
import type { MovieDto } from "@/features/movies/types";
import type { PhraseFormModel } from "@/types/phrase";
import type { TranscriptBlock } from "@/types/movie";
import ContentLoader from "@/components/ui/ContentLoader.vue";
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

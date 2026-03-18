<template>
  <CatalogLayout :title="t.catalog.title" :subtitle="t.catalog.subtitle">
    <AsyncState
      :is-loading="loading"
      :has-data="movies.length > 0"
      :error-message="error"
      :empty-description="t.catalog.noMovies"
      :retry-label="t.catalog.retry"
      :loading-message="t.catalog.loading"
      :loading-icon="Loading"
      :loading-icon-size="32"
      loading-wrapper-class="catalog__loading content-loader-wrap"
      @retry="loadMovies"
    >
      <CatalogPosterGrid
        :items="movies"
        :item-key="(m) => m.movieId"
        :section-title="t.catalog.sectionMovies"
        :xs="12"
        :sm="8"
        :md="6"
        :lg="4"
        :gutter="24"
      >
        <template #item="{ item }">
          <MoviePosterCard :title="item" @click="openMovie(item)" />
        </template>
      </CatalogPosterGrid>
    </AsyncState>
  </CatalogLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLanguage } from "@/composables/useLanguage";
import { useI18n } from "@/i18n";
import { ElMessage } from "element-plus";
import { Loading } from "@element-plus/icons-vue";
import AsyncState from "@/components/ui/AsyncState.vue";
import CatalogPosterGrid from "@/components/layout/CatalogPosterGrid.vue";
import CatalogLayout from "@/components/layout/CatalogLayout.vue";
import { getLimitedMovies } from "@/features/movies/api";
import type { MovieDto } from "@/features/movies/types";
import { CATALOG_MOVIES_LIMIT } from "@/constants/defaults";
import MoviePosterCard from "@/features/movies/components/MoviePosterCard.vue";

const router = useRouter();
const { navQuery } = useLanguage();
const { t } = useI18n();
const movies = ref<MovieDto[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function loadMovies() {
  loading.value = true;
  error.value = null;
  try {
    movies.value = await getLimitedMovies(CATALOG_MOVIES_LIMIT);
  } catch (e) {
    console.error(e);
    error.value = t.value.catalog.errorLoadMovies;
    ElMessage.error(error.value);
  } finally {
    loading.value = false;
  }
}

function openMovie(movie: MovieDto) {
  router.push({
    name: "movie-content",
    params: { movieId: String(movie.movieId) },
    query: navQuery(),
    state: { movie: JSON.parse(JSON.stringify(movie)) },
  });
}

onMounted(loadMovies);
</script>

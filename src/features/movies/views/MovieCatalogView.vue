<template>
  <CatalogLayout>
    <AsyncState
      :is-loading="query.isLoading.value"
      :has-data="movies.length > 0"
      :error-message="query.isError.value ? t.catalog.errorLoadMovies : null"
      :empty-description="t.catalog.noMovies"
      :retry-label="t.catalog.retry"
      :loading-message="t.catalog.loading"
      :loading-icon="Loading"
      :loading-icon-size="32"
      loading-wrapper-class="catalog__loading content-loader-wrap"
      @retry="query.refetch"
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
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { useLanguage } from "@/composables/useLanguage";
import { useI18n } from "@/i18n";
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
const query = useQuery({
  queryKey: ["movies-catalog", CATALOG_MOVIES_LIMIT],
  queryFn: () => getLimitedMovies(CATALOG_MOVIES_LIMIT),
});

const movies = computed<MovieDto[]>(() => query.data.value ?? []);

function openMovie(movie: MovieDto) {
  router.push({
    name: "movie-content",
    params: { movieId: String(movie.movieId) },
    query: navQuery(),
    state: { movie: JSON.parse(JSON.stringify(movie)) },
  });
}

</script>

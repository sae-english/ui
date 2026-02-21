<template>
  <div class="catalog">
    <PageSectionHeader
      title="Learn with movies"
      subtitle="Pick a movie and start practicing"
    />

    <el-main class="catalog__content">
      <div v-if="loading" class="catalog__loading content-loader-wrap">
        <ContentLoader message="Loading catalog..." :icon="Loading" :icon-size="32" />
      </div>

      <el-empty v-else-if="error" :description="error">
        <el-button type="primary" @click="loadMovies">Retry</el-button>
      </el-empty>

      <template v-else>
        <section v-if="movies.length" class="catalog__section">
          <h2 class="catalog__section-title">Movies</h2>
          <el-row :gutter="24" class="catalog__poster-list">
            <el-col
              v-for="movie in movies"
              :key="movie.movieId"
              :xs="12"
              :sm="8"
              :md="6"
              :lg="4"
              class="catalog__poster-item"
            >
              <MoviePosterCard :title="movie" @click="openMovie(movie)" />
            </el-col>
          </el-row>
        </section>

        <el-empty v-else description="No movies" />
      </template>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLanguage } from "@/composables/useLanguage";
import { ElMessage } from "element-plus";
import { Loading } from "@element-plus/icons-vue";
import ContentLoader from "@/components/ui/ContentLoader.vue";
import PageSectionHeader from "@/components/layout/PageSectionHeader.vue";
import { getLimitedMovies } from "@/features/movies/api";
import type { MovieDto } from "@/features/movies/types";
import { CATALOG_MOVIES_LIMIT } from "@/constants/defaults";
import MoviePosterCard from "@/features/movies/components/MoviePosterCard.vue";

const router = useRouter();
const { navQuery } = useLanguage();
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
    error.value =
      "Failed to load movies. Make sure the server is running on port 8080.";
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

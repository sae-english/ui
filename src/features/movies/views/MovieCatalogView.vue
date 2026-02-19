<template>
  <div class="catalog">
    <section class="catalog__header">
      <h1 class="catalog__title">Изучение по фильмам</h1>
      <p class="catalog__subtitle">Выбери фильм и начни практику</p>
    </section>

    <el-main class="catalog__content">
      <div v-if="loading" class="catalog__loading">
        <el-skeleton :rows="4" animated class="catalog__skeleton" />
        <el-space align="center" :size="12">
          <el-icon class="is-loading" :size="32"><Loading /></el-icon>
          <el-text type="info">Загрузка каталога...</el-text>
        </el-space>
      </div>

      <el-empty v-else-if="error" :description="error">
        <el-button type="primary" @click="loadMovies">Повторить</el-button>
      </el-empty>

      <template v-else>
        <section v-if="movies.length" class="catalog__section">
          <h2 class="catalog__section-title">Фильмы</h2>
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

        <el-empty v-else description="Нет фильмов" />
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
import { getLimitedMovies } from "@/features/movies/api";
import type { MovieDto } from "@/features/movies/types";
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
    movies.value = await getLimitedMovies(5);
  } catch (e) {
    console.error(e);
    error.value =
      "Не удалось загрузить фильмы. Проверь, что сервер запущен на порту 8080.";
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

<style scoped>
.catalog {
  min-height: calc(100vh - 60px);
  padding: 0;
  background:
    radial-gradient(
      ellipse 120% 80% at 50% -20%,
      rgba(31, 41, 55, 0.5) 0,
      transparent 50%
    ),
    var(--fe-bg-base);
  font-family: var(--fe-font-body);
}

.catalog__header {
  padding: 32px 24px 24px;
}

.catalog__title {
  font-family: var(--fe-font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--fe-text-primary);
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.catalog__subtitle {
  font-size: 1rem;
  color: var(--fe-text-secondary);
  margin: 0;
}

.catalog__content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 48px !important;
}

.catalog__section {
  margin-bottom: 48px;
}

.catalog__section-title {
  font-family: var(--fe-font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--fe-text-secondary);
  margin: 0 0 20px;
}

.catalog__poster-list {
  margin: 0 !important;
}

.catalog__poster-item {
  margin-bottom: 24px;
}

.catalog__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 64px 24px;
}

.catalog__skeleton {
  width: 100%;
  max-width: 400px;
}

@media (max-width: 600px) {
  .catalog__header {
    padding: 24px 20px 20px;
  }

  .catalog__title {
    font-size: 1.5rem;
  }

  .catalog__content {
    padding: 0 20px 36px !important;
  }
}
</style>

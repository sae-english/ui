import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { DEFAULT_LANGUAGE, isValidLanguage } from '@/types/language'
import HomeView from '@/features/home/views/HomeView.vue'
import MovieCatalogView from '@/features/movies/views/MovieCatalogView.vue'
import MovieContentView from '@/features/movies/views/MovieContentView.vue'
import DictionaryView from '@/features/dictionary/views/DictionaryView.vue'
import SeriesCatalogView from '@/features/series/views/SeriesCatalogView.vue'
import SeriesContentView from '@/features/series/views/SeriesContentView.vue'
import EpisodeView from '@/features/series/views/EpisodeView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/dictionary',
    name: 'dictionary',
    component: DictionaryView,
  },
  {
    path: '/movies',
    name: 'catalog',
    component: MovieCatalogView,
  },
  {
    path: '/movies/:id',
    name: 'movie-redirect',
    redirect: (to) => ({
      name: 'movie-content',
      params: { movieId: to.params.id },
      query: to.query,
    }),
  },
  {
    path: '/movie/:movieId/content',
    name: 'movie-content',
    component: MovieContentView,
    props: true,
  },
  {
    path: '/series',
    name: 'series-catalog',
    component: SeriesCatalogView,
  },
  {
    path: '/series/:seriesId',
    name: 'series-content',
    component: SeriesContentView,
    props: true,
  },
  {
    path: '/episode/:id',
    name: 'episode',
    component: EpisodeView,
    props: true,
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const q = to.query.language
  const value = typeof q === 'string' ? q : null
  if (!value || !isValidLanguage(value)) {
    next({ path: to.path, query: { ...to.query, language: DEFAULT_LANGUAGE } })
  } else {
    next()
  }
})

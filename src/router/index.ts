import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { DEFAULT_LANGUAGE, isValidLanguage } from '@/types/language'
import HomeView from '@/features/home/views/HomeView.vue'
import MovieCatalogView from '@/features/movies/views/MovieCatalogView.vue'
import MovieContentView from '@/features/movies/views/MovieContentView.vue'
import DictionaryView from '@/features/dictionary/views/DictionaryView.vue'
import DictionaryTestModeView from '@/features/dictionary/views/DictionaryTestModeView.vue'
import SeriesCatalogView from '@/features/series/views/SeriesCatalogView.vue'
import SeriesContentView from '@/features/series/views/SeriesContentView.vue'
import EpisodeView from '@/features/series/views/EpisodeView.vue'
import ComedyCatalogView from '@/features/comedy/views/ComedyCatalogView.vue'
import ComedyContentView from '@/features/comedy/views/ComedyContentView.vue'
import MusicCatalogView from '@/features/music/views/MusicCatalogView.vue'
import MusicContentView from '@/features/music/views/MusicContentView.vue'
import BookCatalogView from '@/features/books/views/BookCatalogView.vue'
import BookContentView from '@/features/books/views/BookContentView.vue'
import BookChapterView from '@/features/books/views/BookChapterView.vue'
import SettingsView from '@/features/settings/views/SettingsView.vue'

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
    meta: {
      pageHeaderTitleKey: 'dictionary.title',
      pageHeaderSubtitleKey: 'dictionary.subtitle',
    },
  },
  {
    path: '/dictionary/test',
    name: 'dictionary-test',
    component: DictionaryTestModeView,
    meta: {
      pageHeaderTitleKey: 'dictionary.testMode.title',
      pageHeaderSubtitleKey: 'dictionary.testMode.subtitle',
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      pageHeaderTitleKey: 'settings.title',
      pageHeaderSubtitleKey: 'settings.subtitle',
    },
  },
  {
    path: '/movies',
    name: 'catalog',
    component: MovieCatalogView,
    meta: {
      pageHeaderTitleKey: 'catalog.title',
      pageHeaderSubtitleKey: 'catalog.subtitle',
    },
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
    meta: {
      pageHeaderTitleKey: 'seriesCatalog.title',
      pageHeaderSubtitleKey: 'seriesCatalog.subtitle',
    },
  },
  {
    path: '/comedy',
    name: 'comedy-catalog',
    component: ComedyCatalogView,
    meta: {
      pageHeaderTitleKey: 'comedyCatalog.title',
      pageHeaderSubtitleKey: 'comedyCatalog.subtitle',
    },
  },
  {
    path: '/comedy/:id/content',
    name: 'comedy-content',
    component: ComedyContentView,
    props: true,
  },
  {
    path: '/comedy/:id',
    name: 'comedy-redirect',
    redirect: (to) => ({
      name: 'comedy-content',
      params: { id: to.params.id },
      query: to.query,
    }),
  },
  {
    path: '/music',
    name: 'music-catalog',
    component: MusicCatalogView,
    meta: {
      pageHeaderTitleKey: 'musicCatalog.title',
      pageHeaderSubtitleKey: 'musicCatalog.subtitle',
    },
  },
  {
    path: '/music/:id',
    name: 'music-content',
    component: MusicContentView,
    props: true,
  },
  {
    path: '/books',
    name: 'book-catalog',
    component: BookCatalogView,
    meta: {
      pageHeaderTitleKey: 'bookCatalog.title',
      pageHeaderSubtitleKey: 'bookCatalog.subtitle',
    },
  },
  {
    path: '/books/:id/content',
    name: 'book-content',
    component: BookContentView,
    props: true,
  },
  {
    path: '/books/:id/chapters/:sectionId',
    name: 'book-chapter',
    component: BookChapterView,
    props: true,
  },
  {
    path: '/books/:id',
    name: 'book-redirect',
    redirect: (to) => ({
      name: 'book-content',
      params: { id: to.params.id },
      query: to.query,
    }),
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

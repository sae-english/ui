import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  type StudyLanguage,
  DEFAULT_LANGUAGE,
  isValidLanguage,
  STUDY_LANGUAGE_LABELS,
} from '@/types/language'

export function useLanguage() {
  const route = useRoute()
  const router = useRouter()

  const language = computed<StudyLanguage>(() => {
    const q = route.query.language
    const value = typeof q === 'string' ? q : null
    return value && isValidLanguage(value) ? (value as StudyLanguage) : DEFAULT_LANGUAGE
  })

  function setLanguage(lang: StudyLanguage) {
    router.replace({ query: { ...route.query, language: lang } })
  }

  /** Query-объект с текущим языком для навигации */
  function navQuery(extra?: Record<string, string | string[]>) {
    return { language: language.value, ...extra }
  }

  /** Маршрут с language в query */
  function to(path: string, params?: Record<string, string>) {
    const loc: { path: string; query: Record<string, string>; params?: Record<string, string> } = {
      path,
      query: navQuery(),
    }
    if (params && Object.keys(params).length > 0) {
      loc.params = params
    }
    return loc
  }

  return { language, setLanguage, navQuery, to, STUDY_LANGUAGE_LABELS }
}

/** Study language */
export const StudyLanguage = {
  English: 'en',
  Armenian: 'hy',
} as const

export type StudyLanguage = (typeof StudyLanguage)[keyof typeof StudyLanguage]

export const STUDY_LANGUAGE_LABELS: Record<StudyLanguage, string> = {
  [StudyLanguage.English]: 'English',
  [StudyLanguage.Armenian]: 'Armenian',
}

export const DEFAULT_LANGUAGE: StudyLanguage = StudyLanguage.English

export function isValidLanguage(value: string): value is StudyLanguage {
  return Object.values(StudyLanguage).includes(value as StudyLanguage)
}

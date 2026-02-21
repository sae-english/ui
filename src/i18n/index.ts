import { computed, type ComputedRef } from "vue";
import { useLanguage } from "@/composables/useLanguage";
import type { StudyLanguage } from "@/types/language";
import type { Translations } from "./en";
import { en } from "./en";
import { hy } from "./hy";

const messages: Record<StudyLanguage, Translations> = {
  en,
  hy,
};

/**
 * Returns the translation object for the current app language (from header/query).
 * Reactive: when language changes, t updates and the whole app re-renders with new strings.
 */
export function useI18n(): { t: ComputedRef<Translations> } {
  const { language } = useLanguage();
  const t = computed<Translations>(() => messages[language.value]);
  return { t };
}

/**
 * Get translations for a specific language (e.g. for static use or tests).
 */
export function getTranslations(lang: StudyLanguage): Translations {
  return messages[lang];
}

export { en, hy };
export type { Translations } from "./en";

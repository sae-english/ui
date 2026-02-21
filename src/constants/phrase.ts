/** Drawer title for new phrase */
export const PHRASE_DRAWER_TITLE = "New phrase";

/** Responsive drawer width (% of viewport). Percentage increases on smaller screens. */
export const PHRASE_DRAWER_SIZE = {
  desktop: "50%",
  tablet: "70%",
  mobile: "90%",
} as const;

/** Viewport width breakpoints (px) for drawer size: up to mobile — 90%, up to tablet — 70%, else 50%. */
export const PHRASE_DRAWER_BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
} as const;

/** Drawer open direction */
export const PHRASE_DRAWER_DIRECTION = "rtl";

/** Form field labels */
export const PHRASE_FORM_LABELS = {
  phrase: "Selected phrase",
  translation: "Translation",
  comment: "Comment",
} as const;

/** Form placeholders */
export const PHRASE_FORM_PLACEHOLDERS = {
  translation: "Enter translation",
  comment: "Notes, associations, etc.",
} as const;

/** Button labels */
export const PHRASE_FORM_BUTTONS = {
  translate: "Translate",
  save: "Save",
} as const;

/** Form validation messages */
export const PHRASE_VALIDATION_MESSAGES = {
  phraseRequired: "Enter phrase",
  translationRequired: "Enter translation",
} as const;

/** Form validation rules (Element Plus FormRules) */
export const PHRASE_FORM_RULES = {
  phrase: [
    {
      required: true,
      message: PHRASE_VALIDATION_MESSAGES.phraseRequired,
      trigger: "blur" as const,
    },
  ],
  translation: [
    {
      required: true,
      message: PHRASE_VALIDATION_MESSAGES.translationRequired,
      trigger: "blur" as const,
    },
  ],
};

/** Messages when saving to dictionary */
export const PHRASE_SAVE_MESSAGES = {
  success: "Added to dictionary",
  error: "Failed to save",
} as const;

/** Messages when translating */
export const PHRASE_TRANSLATE_MESSAGES = {
  error: "Failed to translate. Check the server.",
} as const;

/** Section: similar entries already in dictionary */
export const PHRASE_DRAWER_SIMILAR_ENTRIES = {
  title: "Similar entries in dictionary",
  createNew: "Create new",
  empty: "No similar entries found.",
  searching: "Searching...",
  showContext: "Show context",
  hideContext: "Hide context",
} as const;

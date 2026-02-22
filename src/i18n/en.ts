/**
 * English UI strings. Add new keys here; Armenian (hy.ts) must define the same keys (type-checked).
 * Translations type enforces same structure for all locales with string values at leaves.
 */
type StringValues<T> = { [K in keyof T]: T[K] extends object ? StringValues<T[K]> : string };

const en = {
  app: {
    title: "English Movies",
    nav: {
      home: "Home",
      movies: "Movies",
      series: "Series",
      dictionary: "Dictionary",
    },
  },
  home: {
    heroTitle: "English Movies",
    heroTagline: "Learn English through what you love",
    cardMovies: "Movies",
    cardMoviesDesc: "Scripts, dialogues, translations. Pick a movie and start practicing.",
    cardSeries: "Series",
    cardSeriesDesc: "Episode scripts. Pick a series and start reading.",
    cardBooks: "Books",
    cardBooksDesc: "Coming soon",
    cardSongs: "Songs",
    cardSongsDesc: "Coming soon",
  },
  catalog: {
    title: "Learn with movies",
    subtitle: "Pick a movie and start practicing",
    sectionMovies: "Movies",
    loading: "Loading catalog...",
    retry: "Retry",
    noMovies: "No movies",
    errorLoadMovies: "Failed to load movies. Make sure the server is running on port 8080.",
  },
  seriesCatalog: {
    title: "Learn with series",
    subtitle: "Pick a series and read episode scripts",
    sectionSeries: "Series",
    loading: "Loading series...",
    retry: "Retry",
    noSeries: "No series",
    errorLoadSeries: "Failed to load series. Make sure the server is running.",
  },
  seriesContent: {
    backToSeries: "Back to series",
    loadingEpisodes: "Loading episodes...",
    noEpisodes: "No episodes",
    errorLoadEpisodes: "Failed to load episodes",
    episodeLabel: "Episode",
  },
  movieContent: {
    backToMovies: "Back to movies",
    loadingScript: "Loading script...",
    contentNotFound: "Content not found",
    failedLoadScript: "Failed to load script",
  },
  dictionary: {
    title: "Dictionary",
    subtitle: "Words and phrases saved while reading",
    loading: "Loading...",
    retry: "Retry",
    empty: "Dictionary is empty",
    emptyHint: "Select phrases while reading scripts and save them to the dictionary.",
    deleteTitle: "Delete entry?",
    deleteMessage: "Delete \"{{value}}\" from the dictionary?",
    cancel: "Cancel",
    delete: "Delete",
    deleted: "Deleted",
    failedDelete: "Failed to delete",
    failedLoad: "Failed to load dictionary. Make sure the server is running.",
  },
  episode: {
    back: "Back",
    loadingEpisode: "Loading episode...",
    notFound: "Episode not found",
    toHome: "To home",
    failedLoadEpisode: "Failed to load episode",
  },
  phrase: {
    drawerTitle: "New phrase",
    addToDictionary: "Add to dictionary",
    form: {
      phrase: "Selected phrase",
      translation: "Translation",
      comment: "Comment",
      placeholderTranslation: "Enter translation",
      placeholderComment: "Notes, associations, etc.",
      translate: "Translate",
      save: "Save",
      validationPhraseRequired: "Enter phrase",
      validationTranslationRequired: "Enter translation",
      successAdded: "Added to dictionary",
      errorSave: "Failed to save",
      errorTranslate: "Failed to translate. Check the server.",
    },
    similar: {
      title: "Similar entries in dictionary",
      createNew: "Create new",
      empty: "No similar entries found.",
      searching: "Searching...",
      showContext: "Show context",
      hideContext: "Hide context",
    },
  },
  common: {
    loading: "Loading...",
    loadMore: "Load more",
    scene: "Scene",
    extendedVersion: "extended version",
    movie: "Movie",
    series: "Series",
  },
} as const;

export type Translations = StringValues<typeof en>;
export { en };

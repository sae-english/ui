<template>
  <el-drawer
    :model-value="visible"
    :title="t.phrase.drawerTitle"
    :direction="PHRASE_DRAWER_DIRECTION"
    :size="drawerSize"
    @update:model-value="emit('update:visible', $event)"
  >
    <el-main class="phrase-drawer__body">
      <PhraseDrawerSimilarList
        v-if="showListView"
        :entries="similarEntries"
        :loading="searchQuery.isFetching.value"
        :title="similarEntriesTitle"
        :create-new-label="t.phrase.similar.createNew"
        :searching-label="t.phrase.similar.searching"
        :show-context-label="t.phrase.similar.showContext"
        :hide-context-label="t.phrase.similar.hideContext"
        @create-new="openCreateForm"
      />

      <PhraseDrawerForm
        v-if="showFormView"
        :form="form"
        :form-rules="phraseFormRules"
        :can-submit="canSubmit"
        :translate-loading="translateMutation.isPending.value"
        :save-loading="saveMutation.isPending.value"
        :phrase-label="t.phrase.form.phrase"
        :translation-label="t.phrase.form.translation"
        :comment-label="t.phrase.form.comment"
        :translation-placeholder="t.phrase.form.placeholderTranslation"
        :comment-placeholder="t.phrase.form.placeholderComment"
        :translate-button-label="t.phrase.form.translate"
        :save-button-label="t.phrase.form.save"
        @translate="onTranslate"
        @submit="onSubmit"
      />
    </el-main>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useWindowSize, useDebounceFn } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { PhraseFormModel } from "@/types/phrase";
import type { DictionaryContentType } from "@/services/api";
import {
  translate as translateApi,
  saveDictionaryEntry,
  searchDictionaryByValue,
} from "@/services/api";
import { useI18n } from "@/i18n";
import {
  PHRASE_DRAWER_DIRECTION,
  PHRASE_DRAWER_SIZE,
  PHRASE_DRAWER_BREAKPOINTS,
} from "@/constants/phrase";
import PhraseDrawerSimilarList from "@/components/script/PhraseDrawerSimilarList.vue";
import PhraseDrawerForm from "@/components/script/PhraseDrawerForm.vue";

/** Open context: phrase and content link (for API on save). */
export interface PhraseDrawerOpenContext {
  contentKey?: string | null;
  contentType: DictionaryContentType;
  blockId?: string | null;
}

const props = defineProps<{
  visible: boolean;
  initialPhrase: string;
  contentKey?: string | null;
  contentType: DictionaryContentType;
  blockId?: string | null;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

const { t } = useI18n();

const phraseFormRules = computed(() => ({
  phrase: [
    {
      required: true,
      message: t.value.phrase.form.validationPhraseRequired,
      trigger: "blur" as const,
    },
  ],
  translation: [
    {
      required: true,
      message: t.value.phrase.form.validationTranslationRequired,
      trigger: "blur" as const,
    },
  ],
}));

const form = ref<PhraseFormModel>({
  phrase: "",
  translation: "",
  comment: "",
});

const { width: windowWidth } = useWindowSize();
const drawerSize = computed(() => {
  const w = windowWidth.value;
  if (w <= PHRASE_DRAWER_BREAKPOINTS.mobile) return PHRASE_DRAWER_SIZE.mobile;
  if (w <= PHRASE_DRAWER_BREAKPOINTS.tablet) return PHRASE_DRAWER_SIZE.tablet;
  return PHRASE_DRAWER_SIZE.desktop;
});

const canSubmit = computed(
  () => !!form.value.phrase?.trim() && !!form.value.translation?.trim(),
);

const openContext = ref<PhraseDrawerOpenContext | null>(null);
const searchTerm = ref("");
const showForm = ref(false);

const searchQuery = useQuery({
  queryKey: computed(() => ["dictionary-search", searchTerm.value] as const),
  queryFn: () => searchDictionaryByValue(searchTerm.value),
  enabled: computed(() => props.visible && searchTerm.value.length > 0),
});

const similarEntries = computed(() => searchQuery.data.value ?? []);
const similarEntriesTitle = computed(() => {
  const n = similarEntries.value.length;
  const base = t.value.phrase.similar.title;
  return n ? `${base} (${n})` : base;
});

/** Show list only when we have search term and (loading or has results); form is hidden. */
const showListView = computed(
  () =>
    !showForm.value &&
    !!searchTerm.value &&
    (searchQuery.isFetching.value || similarEntries.value.length > 0),
);

/** Show form when user chose create, or no search term, or search finished with 0 results. */
const showFormView = computed(
  () =>
    showForm.value ||
    !searchTerm.value ||
    (searchQuery.isSuccess.value &&
      !searchQuery.isFetching.value &&
      similarEntries.value.length === 0),
);

const setSearchDebounced = useDebounceFn((value: string) => {
  searchTerm.value = value;
}, 400);

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      form.value = {
        phrase: props.initialPhrase.trim(),
        translation: "",
        comment: "",
      };
      searchTerm.value = form.value.phrase;
      showForm.value = false;
      openContext.value = {
        contentKey: props.contentKey ?? undefined,
        contentType: props.contentType,
        blockId: props.blockId ?? undefined,
      };
    } else {
      openContext.value = null;
      searchTerm.value = "";
      showForm.value = false;
    }
  },
);

/** Only switch to form when search has actually completed with 0 results (not on initial empty state). */
watch(
  [
    () => props.visible,
    () => searchQuery.isSuccess.value,
    () => searchQuery.isFetching.value,
    () => similarEntries.value.length,
    () => searchTerm.value,
  ],
  ([visible, success, fetching, count, term]) => {
    if (
      visible &&
      success &&
      !fetching &&
      count === 0 &&
      !!term
    ) {
      showForm.value = true;
    }
  },
);

watch(
  () => form.value.phrase?.trim() ?? "",
  (phrase) => {
    if (props.visible) setSearchDebounced(phrase);
  },
);

const translateMutation = useMutation({
  mutationFn: (text: string) => translateApi(text),
  onSuccess: (data) => {
    form.value = { ...form.value, translation: data.translation };
  },
  onError: () => {
    ElMessage.error(t.value.phrase.form.errorTranslate);
  },
});

const saveMutation = useMutation({
  mutationFn: saveDictionaryEntry,
  onSuccess: () => {
    ElMessage.success(t.value.phrase.form.successAdded);
    emit("update:visible", false);
  },
  onError: () => {
    ElMessage.error(t.value.phrase.form.errorSave);
  },
});

function openCreateForm() {
  showForm.value = true;
}

function onTranslate() {
  const text = form.value.phrase?.trim();
  if (!text) return;
  translateMutation.mutate(text);
}

function onSubmit() {
  const ctx = openContext.value;
  if (!ctx || !canSubmit.value) return;
  saveMutation.mutate({
    value: form.value.phrase.trim(),
    translation: form.value.translation.trim(),
    comment: form.value.comment?.trim(),
    contentKey: ctx.contentKey,
    contentType: ctx.contentType,
    blockId: ctx.blockId,
  });
}
</script>

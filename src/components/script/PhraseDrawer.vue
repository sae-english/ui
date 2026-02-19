<template>
  <el-drawer
    :model-value="visible"
    title="Новая фраза"
    direction="rtl"
    size="360px"
    @update:model-value="emit('update:visible', $event)"
  >
    <el-main class="phrase-drawer__body">
      <el-form label-position="top" class="phrase-drawer__form">
        <el-form-item label="Выделенная фраза">
          <el-input
            :model-value="form.phrase"
            type="textarea"
            rows="2"
            resize="none"
            @update:model-value="updateField('phrase', $event)"
          />
          <el-button
            class="phrase-drawer__translate-btn"
            :loading="translating"
            :disabled="translating || !form.phrase?.trim()"
            @click="onTranslate"
          >
            Перевести
          </el-button>
        </el-form-item>

        <el-form-item label="Перевод">
          <el-input
            :model-value="form.translation"
            type="textarea"
            rows="2"
            resize="none"
            placeholder="Введите перевод"
            @update:model-value="updateField('translation', $event)"
          />
        </el-form-item>

        <el-form-item label="Комментарий">
          <el-input
            :model-value="form.comment"
            type="textarea"
            rows="3"
            resize="none"
            placeholder="Любые заметки, ассоциации и т.п."
            @update:model-value="updateField('comment', $event)"
          />
        </el-form-item>

        <el-space class="phrase-drawer__actions" justify="flex-end">
          <el-button
            type="primary"
            :loading="loading"
            :disabled="loading"
            @click="onSubmit"
          >
            Сохранить
          </el-button>
        </el-space>
      </el-form>
    </el-main>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { PhraseFormModel } from '@/types/phrase'
import type { DictionaryContentType } from '@/services/api'
import { translate as translateApi } from '@/services/api'

/** Контекст для привязки записи словаря к контенту (фильм/эпизод и блок). */
export interface DictionaryContext {
  contentKey?: string | null
  contentType?: DictionaryContentType | null
  blockId?: string | null
}

const props = defineProps<{
  visible: boolean
  form: PhraseFormModel
  loading?: boolean
  /** Контекст контента (contentKey, contentType, blockId) — передаётся в API при сохранении в словарь. */
  dictionaryContext?: DictionaryContext | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:form': [value: PhraseFormModel]
  submit: [payload: { form: PhraseFormModel; context?: DictionaryContext | null }]
}>()

const translating = ref(false)

function updateField<K extends keyof PhraseFormModel>(
  field: K,
  value: PhraseFormModel[K],
) {
  emit('update:form', { ...props.form, [field]: value })
}

async function onTranslate() {
  const text = props.form.phrase?.trim()
  if (!text) return
  translating.value = true
  try {
    const result = await translateApi(text)
    emit('update:form', { ...props.form, translation: result.translation })
  } catch (e) {
    console.error(e)
    ElMessage.error('Не удалось перевести. Проверь сервер.')
  } finally {
    translating.value = false
  }
}

function onSubmit() {
  emit('submit', {
    form: props.form,
    context: props.dictionaryContext ?? undefined,
  })
}
</script>

<style scoped>
.phrase-drawer__body {
  padding-right: 4px;
}

.phrase-drawer__translate-btn {
  margin-top: 8px;
}

.phrase-drawer__form :deep(.el-form-item__label) {
  font-size: 0.9rem;
  color: var(--fe-text-muted);
}

.phrase-drawer__form :deep(.el-textarea__inner),
.phrase-drawer__form :deep(.el-input__inner) {
  font-size: 0.95rem;
}

.phrase-drawer__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>

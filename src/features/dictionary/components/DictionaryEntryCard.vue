<template>
  <el-card
    class="dictionary-entry-card"
    shadow="hover"
    body-style="padding: 14px 16px;"
  >
    <div class="dictionary-entry-card__body">
      <div class="dictionary-entry-card__main">
        <span class="dictionary-entry-card__value">{{ entry.value }}</span>
        <span class="dictionary-entry-card__translation">{{ entry.translation }}</span>
        <el-divider
          v-if="entry.comments?.length"
          class="dictionary-entry-card__divider"
          border-style="solid"
          :style="{ margin: '4px 0' }"
        />
        <ul v-if="entry.comments?.length" class="dictionary-entry-card__comments">
          <li
            v-for="(comment, idx) in entry.comments"
            :key="idx"
            class="dictionary-entry-card__comment-item"
          >
            {{ comment }}
          </li>
        </ul>
      </div>
      <div class="dictionary-entry-card__footer">
        <el-text type="info" size="small" class="dictionary-entry-card__date">
          {{ formatDate(entry.createdAt) }}
        </el-text>
        <el-button
          circle
          text
          type="danger"
          size="small"
          :icon="Delete"
          class="dictionary-entry-card__delete"
          @click="$emit('delete')"
        />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import type { DictionaryDto } from '@/services/api'

defineProps<{
  entry: DictionaryDto
}>()

defineEmits<{
  delete: []
}>()

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<style scoped>
.dictionary-entry-card {
  border-radius: 14px;
  border: 1px solid var(--el-border-color-lighter);
  overflow: hidden;
}

.dictionary-entry-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dictionary-entry-card__main {
  flex: 1;
  min-width: 0;
}

.dictionary-entry-card__value {
  font-family: var(--fe-font-heading);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--fe-text-primary);
  display: block;
  margin-bottom: 4px;
}

.dictionary-entry-card__translation {
  font-size: 1rem;
  color: var(--fe-text-secondary);
  display: block;
  margin-bottom: 4px;
}

.dictionary-entry-card__comments {
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dictionary-entry-card__comment-item {
  font-size: 0.9rem;
  color: var(--fe-text-muted);
  font-style: italic;
  line-height: 1.4;
  position: relative;
  padding-left: 14px;
}

.dictionary-entry-card__comment-item::before {
  content: "•";
  position: absolute;
  left: 0;
  top: 0;
}

.dictionary-entry-card__divider :deep(.el-divider__line) {
  border-top-color: var(--el-border-color-lighter);
  border-top-style: solid;
}

.dictionary-entry-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  gap: 12px;
}

.dictionary-entry-card__date {
  opacity: 0.75;
}

.dictionary-entry-card__delete :deep(.el-icon) {
  font-size: 16px;
}

@media (max-width: 600px) {
  .dictionary-entry-card__body {
    gap: 6px;
  }
}

@media (max-width: 360px) {
  .dictionary-entry-card__value {
    font-size: 1.05rem;
  }

  .dictionary-entry-card__translation {
    font-size: 0.95rem;
  }

  .dictionary-entry-card__footer {
    gap: 8px;
  }

  .dictionary-entry-card :deep(.el-card__body) {
    padding: 12px 12px !important;
  }
}
</style>

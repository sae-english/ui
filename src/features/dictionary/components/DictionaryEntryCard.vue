<template>
  <el-card class="dictionary-entry-card" shadow="hover">
    <div class="dictionary-entry-card__body">
      <div class="dictionary-entry-card__main">
        <span class="dictionary-entry-card__value">{{ entry.value }}</span>
        <span class="dictionary-entry-card__translation">{{ entry.translation }}</span>
        <p v-if="entry.comment" class="dictionary-entry-card__comment">{{ entry.comment }}</p>
      </div>
      <div class="dictionary-entry-card__meta">
        <el-text type="info" size="small">
          {{ formatDate(entry.createdAt) }}
        </el-text>
        <el-button
          type="danger"
          text
          size="small"
          :icon="Delete"
          @click="$emit('delete')"
        >
          Удалить
        </el-button>
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
  border-radius: 12px;
  border: 1px solid var(--fe-border);
  background: var(--fe-bg-card);
}

.dictionary-entry-card__body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
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

.dictionary-entry-card__comment {
  font-size: 0.95rem;
  color: var(--fe-text-muted);
  font-style: italic;
  margin: 0;
  line-height: 1.4;
}

.dictionary-entry-card__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .dictionary-entry-card__body {
    flex-direction: column;
  }
}
</style>

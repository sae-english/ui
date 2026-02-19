<template>
  <div class="dictionary">
    <section class="dictionary__header">
      <h1 class="dictionary__title">Словарь</h1>
      <p class="dictionary__subtitle">Слова и фразы, сохранённые при чтении</p>
    </section>

    <el-main class="dictionary__content">
      <div v-if="loading" class="dictionary__loading">
        <el-icon class="is-loading" :size="36"><Loading /></el-icon>
        <el-text type="info">Загрузка...</el-text>
      </div>

      <el-empty v-else-if="error" :description="error">
        <el-button type="primary" @click="loadEntries">Повторить</el-button>
      </el-empty>

      <el-empty v-else-if="!entries.length" description="Словарь пуст">
        <el-text type="info" size="small">
          Выделяй фразы при чтении скриптов и сохраняй их в словарь.
        </el-text>
      </el-empty>

      <ul v-else class="dictionary__list">
        <li
          v-for="entry in entries"
          :key="entry.id"
          class="dictionary__item"
        >
          <el-card class="dictionary__card" shadow="hover">
            <div class="dictionary__card-body">
              <div class="dictionary__card-main">
                <span class="dictionary__value">{{ entry.value }}</span>
                <span class="dictionary__translation">{{ entry.translation }}</span>
                <p v-if="entry.comment" class="dictionary__comment">{{ entry.comment }}</p>
              </div>
              <div class="dictionary__card-meta">
                <el-text type="info" size="small">
                  {{ formatDate(entry.createdAt) }}
                </el-text>
                <el-button
                  type="danger"
                  text
                  size="small"
                  :icon="Delete"
                  @click="confirmDelete(entry)"
                >
                  Удалить
                </el-button>
              </div>
            </div>
          </el-card>
        </li>
      </ul>
    </el-main>

    <el-dialog
      v-model="deleteDialogVisible"
      title="Удалить запись?"
      width="400px"
      :close-on-click-modal="true"
    >
      <p>Удалить «{{ entryToDelete?.value }}» из словаря?</p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">Отмена</el-button>
        <el-button type="danger" :loading="deleting" @click="doDelete">
          Удалить
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, Delete } from '@element-plus/icons-vue'
import {
  getDictionaryEntries,
  deleteDictionaryEntry,
  type DictionaryDto,
} from '@/services/api'

const entries = ref<DictionaryDto[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const deleteDialogVisible = ref(false)
const entryToDelete = ref<DictionaryDto | null>(null)
const deleting = ref(false)

async function loadEntries() {
  loading.value = true
  error.value = null
  try {
    entries.value = await getDictionaryEntries()
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось загрузить словарь. Проверь, что сервер запущен.'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function confirmDelete(entry: DictionaryDto) {
  entryToDelete.value = entry
  deleteDialogVisible.value = true
}

async function doDelete() {
  const entry = entryToDelete.value
  if (!entry) return
  deleting.value = true
  try {
    await deleteDictionaryEntry(entry.id)
    entries.value = entries.value.filter((e) => e.id !== entry.id)
    deleteDialogVisible.value = false
    entryToDelete.value = null
    ElMessage.success('Удалено')
  } catch (e) {
    console.error(e)
    ElMessage.error('Не удалось удалить')
  } finally {
    deleting.value = false
  }
}

onMounted(loadEntries)
</script>

<style scoped>
.dictionary {
  min-height: calc(100vh - 60px);
  padding: 0;
  background:
    radial-gradient(ellipse 120% 80% at 50% -20%, rgba(31, 41, 55, 0.5) 0, transparent 50%),
    var(--fe-bg-base);
  font-family: var(--fe-font-body);
}

.dictionary__header {
  padding: 32px 24px 24px;
}

.dictionary__title {
  font-family: var(--fe-font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--fe-text-primary);
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.dictionary__subtitle {
  font-size: 1rem;
  color: var(--fe-text-secondary);
  margin: 0;
}

.dictionary__content {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px 48px !important;
}

.dictionary__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 64px 24px;
}

.dictionary__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dictionary__item {
  margin: 0;
  padding: 0;
}

.dictionary__card {
  border-radius: 12px;
  border: 1px solid var(--fe-border);
  background: var(--fe-bg-card);
}

.dictionary__card-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.dictionary__card-main {
  flex: 1;
  min-width: 0;
}

.dictionary__value {
  font-family: var(--fe-font-heading);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--fe-text-primary);
  display: block;
  margin-bottom: 4px;
}

.dictionary__translation {
  font-size: 1rem;
  color: var(--fe-text-secondary);
  display: block;
  margin-bottom: 4px;
}

.dictionary__comment {
  font-size: 0.95rem;
  color: var(--fe-text-muted);
  font-style: italic;
  margin: 0;
  line-height: 1.4;
}

.dictionary__card-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .dictionary__header {
    padding: 24px 20px 20px;
  }

  .dictionary__title {
    font-size: 1.5rem;
  }

  .dictionary__content {
    padding: 0 20px 36px !important;
  }

  .dictionary__card-body {
    flex-direction: column;
  }
}
</style>

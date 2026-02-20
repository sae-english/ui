<template>
  <div class="dictionary">
    <PageSectionHeader
      title="Словарь"
      subtitle="Слова и фразы, сохранённые при чтении"
    />

    <el-main class="dictionary__content">
      <div v-if="loading" class="dictionary__loading content-loader-wrap">
        <ContentLoader message="Загрузка..." :icon="Loading" :icon-size="36" />
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
          <DictionaryEntryCard
            :entry="entry"
            @delete="confirmDelete(entry)"
          />
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
import { Loading } from '@element-plus/icons-vue'
import ContentLoader from '@/components/ui/ContentLoader.vue'
import PageSectionHeader from '@/components/layout/PageSectionHeader.vue'
import DictionaryEntryCard from '@/features/dictionary/components/DictionaryEntryCard.vue'
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

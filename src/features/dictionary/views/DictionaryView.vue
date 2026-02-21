<template>
  <div class="dictionary">
    <PageSectionHeader
      :title="t.dictionary.title"
      :subtitle="t.dictionary.subtitle"
    />

    <el-main class="dictionary__content">
      <div v-if="loading" class="dictionary__loading content-loader-wrap">
        <ContentLoader :message="t.dictionary.loading" :icon="Loading" :icon-size="36" />
      </div>

      <el-empty v-else-if="error" :description="error">
        <el-button type="primary" @click="loadEntries">{{ t.dictionary.retry }}</el-button>
      </el-empty>

      <el-empty v-else-if="!entries.length" :description="t.dictionary.empty">
        <el-text type="info" size="small">
          {{ t.dictionary.emptyHint }}
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
      :title="t.dictionary.deleteTitle"
      width="400px"
      :close-on-click-modal="true"
    >
      <p>{{ deleteConfirmMessage }}</p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">{{ t.dictionary.cancel }}</el-button>
        <el-button type="danger" :loading="deleting" @click="doDelete">
          {{ t.dictionary.delete }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { useI18n } from '@/i18n'
import ContentLoader from '@/components/ui/ContentLoader.vue'
import PageSectionHeader from '@/components/layout/PageSectionHeader.vue'
import DictionaryEntryCard from '@/features/dictionary/components/DictionaryEntryCard.vue'
import {
  getDictionaryEntries,
  deleteDictionaryEntry,
  type DictionaryDto,
} from '@/services/api'

const { t } = useI18n()

const entries = ref<DictionaryDto[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const deleteDialogVisible = ref(false)
const entryToDelete = ref<DictionaryDto | null>(null)
const deleting = ref(false)

const deleteConfirmMessage = computed(() =>
  t.value.dictionary.deleteMessage.replace('{{value}}', entryToDelete.value?.value ?? ''),
)

async function loadEntries() {
  loading.value = true
  error.value = null
  try {
    entries.value = await getDictionaryEntries()
  } catch (e) {
    console.error(e)
    error.value = t.value.dictionary.failedLoad
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
    ElMessage.success(t.value.dictionary.deleted)
  } catch (e) {
    console.error(e)
    ElMessage.error(t.value.dictionary.failedDelete)
  } finally {
    deleting.value = false
  }
}

onMounted(loadEntries)
</script>

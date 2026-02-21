<template>
  <div class="dictionary">
    <PageSectionHeader
      title="Dictionary"
      subtitle="Words and phrases saved while reading"
    />

    <el-main class="dictionary__content">
      <div v-if="loading" class="dictionary__loading content-loader-wrap">
        <ContentLoader message="Loading..." :icon="Loading" :icon-size="36" />
      </div>

      <el-empty v-else-if="error" :description="error">
        <el-button type="primary" @click="loadEntries">Retry</el-button>
      </el-empty>

      <el-empty v-else-if="!entries.length" description="Dictionary is empty">
        <el-text type="info" size="small">
          Select phrases while reading scripts and save them to the dictionary.
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
      title="Delete entry?"
      width="400px"
      :close-on-click-modal="true"
    >
      <p>Delete "{{ entryToDelete?.value }}" from the dictionary?</p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">Cancel</el-button>
        <el-button type="danger" :loading="deleting" @click="doDelete">
          Delete
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
    error.value = 'Failed to load dictionary. Make sure the server is running.'
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
    ElMessage.success('Deleted')
  } catch (e) {
    console.error(e)
    ElMessage.error('Failed to delete')
  } finally {
    deleting.value = false
  }
}

onMounted(loadEntries)
</script>

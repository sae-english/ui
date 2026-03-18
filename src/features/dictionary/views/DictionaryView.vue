<template>
  <div class="dictionary">
    <div class="dictionary__header">
      <PageSectionHeader
        :title="t.dictionary.title"
        :subtitle="t.dictionary.subtitle"
      />

      <el-button
        circle
        type="primary"
        class="dictionary__add-btn"
        :title="t.phrase.drawerTitle"
        @click="openAddDrawer"
      >
        <el-icon>
          <DocumentAdd />
        </el-icon>
      </el-button>
    </div>

    <el-main class="dictionary__content">
      <AsyncState
        :is-loading="query.isLoading.value && !hasLoadedOnce"
        :has-data="allEntries.length > 0"
        :error-message="errorMessage || null"
        :empty-description="t.dictionary.empty"
        :retry-label="t.dictionary.retry"
        :loading-message="t.dictionary.loading"
        :loading-icon="Loading"
        :loading-icon-size="36"
        loading-wrapper-class="dictionary__loading content-loader-wrap"
        @retry="query.refetch"
      >
        <template #empty>
          <el-empty :description="t.dictionary.empty">
            <el-text type="info" size="small">
              {{ t.dictionary.emptyHint }}
            </el-text>
          </el-empty>
        </template>

        <ul class="dictionary__list">
          <li
            v-for="entry in allEntries"
            :key="entry.id"
            class="dictionary__item"
          >
            <DictionaryEntryCard
              :entry="entry"
              @delete="confirmDelete(entry)"
            />
          </li>
        </ul>

        <InfiniteScrollLoadMore
          :has-next-page="query.hasNextPage.value"
          :is-fetching-next-page="query.isFetchingNextPage.value"
          class="dictionary__load-more"
          @load-more="query.fetchNextPage()"
        />
      </AsyncState>
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

    <PhraseDrawer
      v-model:visible="drawerVisible"
      :initial-phrase="drawerInitialPhrase"
      :content-key="null"
      :content-type="drawerContentType"
      :block-id="null"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, DocumentAdd } from '@element-plus/icons-vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { useI18n } from '@/i18n'
import { useLanguage } from '@/composables/useLanguage'
import PageSectionHeader from '@/components/layout/PageSectionHeader.vue'
import DictionaryEntryCard from '@/features/dictionary/components/DictionaryEntryCard.vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import {
  getDictionaryPage,
  deleteDictionaryEntry,
  type DictionaryContentType,
  type DictionaryDto,
} from '@/services/api'
import InfiniteScrollLoadMore from '@/components/ui/InfiniteScrollLoadMore.vue'
import PhraseDrawer from '@/components/script/PhraseDrawer.vue'

const { t } = useI18n()
const { language } = useLanguage()

const deleteDialogVisible = ref(false)
const entryToDelete = ref<DictionaryDto | null>(null)
const deleting = ref(false)

const deleteConfirmMessage = computed(() =>
  t.value.dictionary.deleteMessage.replace('{{value}}', entryToDelete.value?.value ?? ''),
)

const langParam = computed(() => (language.value === 'hy' ? 'ARMENIAN' : 'ENGLISH'))

const query = useInfiniteQuery({
  queryKey: computed(() => ['dictionary', langParam.value] as const),
  queryFn: async ({ pageParam }) => {
    const page = await getDictionaryPage({
      language: langParam.value,
      after: pageParam ?? null,
      limit: 10,
    })
    return page
  },
  initialPageParam: null as number | null,
  getNextPageParam: (lastPage) =>
    lastPage.hasMore && lastPage.nextId != null ? lastPage.nextId : undefined,
})

const allEntries = computed<DictionaryDto[]>(() => {
  const pages = query.data.value?.pages ?? []
  return pages.flatMap((p) => p.entries ?? [])
})

const hasLoadedOnce = computed(() => (query.data.value?.pages?.length ?? 0) > 0)

const errorMessage = computed(() => {
  if (query.isError.value) return t.value.dictionary.failedLoad
  return ''
})

const drawerVisible = ref(false)
const drawerInitialPhrase = ref('')
// Dictionary entries created from the dictionary page don't have content context.
// We still need to send some DictionaryContentType to backend; contentKey/blockId will be omitted.
const drawerContentType: DictionaryContentType = 'MOVIE'

function openAddDrawer() {
  drawerInitialPhrase.value = ''
  drawerVisible.value = true
}

watch(drawerVisible, (visible, prev) => {
  if (prev && !visible) query.refetch()
})

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
    await query.refetch()
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
</script>

<style scoped>
.dictionary__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.dictionary__add-btn {
  margin-top: 6px;
}

@media (max-width: 600px) {
  .dictionary__header {
    margin-bottom: 12px;
  }

  .dictionary__add-btn {
    margin-top: 2px;
  }
}
</style>

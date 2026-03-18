<template>
  <div class="dictionary">
    <PageSectionHeader
      :title="t.dictionary.title"
      :subtitle="t.dictionary.subtitle"
    />

    <el-main class="dictionary__content">
      <div
        v-if="query.isLoading.value && !hasLoadedOnce"
        class="dictionary__loading content-loader-wrap"
      >
        <ContentLoader :message="t.dictionary.loading" :icon="Loading" :icon-size="36" />
      </div>

      <el-empty v-else-if="errorMessage" :description="errorMessage">
        <el-button type="primary" @click="query.refetch">
          {{ t.dictionary.retry }}
        </el-button>
      </el-empty>

      <el-empty v-else-if="!allEntries.length" :description="t.dictionary.empty">
        <el-text type="info" size="small">
          {{ t.dictionary.emptyHint }}
        </el-text>
      </el-empty>

      <template v-else>
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
      </template>
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
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { useI18n } from '@/i18n'
import { useLanguage } from '@/composables/useLanguage'
import ContentLoader from '@/components/ui/ContentLoader.vue'
import PageSectionHeader from '@/components/layout/PageSectionHeader.vue'
import DictionaryEntryCard from '@/features/dictionary/components/DictionaryEntryCard.vue'
import {
  getDictionaryPage,
  deleteDictionaryEntry,
  type DictionaryDto,
} from '@/services/api'
import InfiniteScrollLoadMore from '@/components/ui/InfiniteScrollLoadMore.vue'

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

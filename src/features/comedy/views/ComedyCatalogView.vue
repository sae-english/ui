<template>
  <div class="catalog">
    <PageSectionHeader
      :title="t.comedyCatalog.title"
      :subtitle="t.comedyCatalog.subtitle"
    />

    <el-main class="catalog__content">
      <AsyncState
        :is-loading="loading"
        :has-data="specials.length > 0"
        :error-message="error"
        :empty-description="t.comedyCatalog.noSpecials"
        :retry-label="t.comedyCatalog.retry"
        :loading-message="t.comedyCatalog.loading"
        :loading-icon="Loading"
        :loading-icon-size="32"
        loading-wrapper-class="catalog__loading content-loader-wrap"
        @retry="loadSpecials"
      >
        <CatalogPosterGrid
          :items="specials"
          :item-key="(sp) => sp.id"
          :section-title="t.comedyCatalog.sectionSpecials"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="4"
          :gutter="24"
        >
          <template #item="{ item }">
            <ComedySpecialCard :special="item" @click="openSpecial(item)" />
          </template>
        </CatalogPosterGrid>
      </AsyncState>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import PageSectionHeader from '@/components/layout/PageSectionHeader.vue'
import CatalogPosterGrid from '@/components/layout/CatalogPosterGrid.vue'
import { getComedySpecials } from '@/features/comedy/api'
import type { ComedySpecialDto } from '@/features/comedy/types'
import { CATALOG_COMEDY_LIMIT } from '@/constants/defaults'
import ComedySpecialCard from '@/features/comedy/components/ComedySpecialCard.vue'

const router = useRouter()
const { navQuery } = useLanguage()
const { t } = useI18n()
const specials = ref<ComedySpecialDto[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function loadSpecials() {
  loading.value = true
  error.value = null
  try {
    specials.value = await getComedySpecials(CATALOG_COMEDY_LIMIT)
  } catch (e) {
    console.error(e)
    error.value = t.value.comedyCatalog.errorLoadSpecials
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

function openSpecial(special: ComedySpecialDto) {
  router.push({
    name: 'comedy-content',
    params: { id: String(special.id) },
    query: navQuery(),
    state: { special: JSON.parse(JSON.stringify(special)) },
  })
}

onMounted(loadSpecials)
</script>

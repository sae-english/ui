<template>
  <CatalogLayout>
    <AsyncState
      :is-loading="query.isLoading.value"
      :has-data="specials.length > 0"
      :error-message="query.isError.value ? t.comedyCatalog.errorLoadSpecials : null"
      :empty-description="t.comedyCatalog.noSpecials"
      :retry-label="t.comedyCatalog.retry"
      :loading-message="t.comedyCatalog.loading"
      :loading-icon="Loading"
      :loading-icon-size="32"
      loading-wrapper-class="catalog__loading content-loader-wrap"
      @retry="query.refetch"
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
  </CatalogLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import { Loading } from '@element-plus/icons-vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import CatalogLayout from '@/components/layout/CatalogLayout.vue'
import CatalogPosterGrid from '@/components/layout/CatalogPosterGrid.vue'
import { getComedySpecials } from '@/features/comedy/api'
import type { ComedySpecialDto } from '@/features/comedy/types'
import { CATALOG_COMEDY_LIMIT } from '@/constants/defaults'
import ComedySpecialCard from '@/features/comedy/components/ComedySpecialCard.vue'

const router = useRouter()
const { navQuery } = useLanguage()
const { t } = useI18n()
const query = useQuery({
  queryKey: ['comedy-catalog', CATALOG_COMEDY_LIMIT],
  queryFn: () => getComedySpecials(CATALOG_COMEDY_LIMIT),
})
const specials = computed<ComedySpecialDto[]>(() => query.data.value ?? [])

function openSpecial(special: ComedySpecialDto) {
  router.push({
    name: 'comedy-content',
    params: { id: String(special.id) },
    query: navQuery(),
    state: { special: JSON.parse(JSON.stringify(special)) },
  })
}

</script>

<template>
  <CatalogLayout :title="t.musicCatalog.title" :subtitle="t.musicCatalog.subtitle">
    <AsyncState
      :is-loading="query.isLoading.value"
      :has-data="tracks.length > 0"
      :error-message="errorMessage || null"
      :empty-description="t.musicCatalog.noTracks"
      :retry-label="t.musicCatalog.retry"
      :loading-message="t.musicCatalog.loading"
      loading-wrapper-class="catalog__loading content-loader-wrap"
      @retry="query.refetch"
    >
      <CatalogPosterGrid
        :items="tracks"
        :item-key="(x) => x.id"
        :section-title="null"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :gutter="24"
      >
        <template #item="{ item }">
          <MusicTrackCard
            :track="item"
            :to="{
              name: 'music-content',
              params: { id: item.id },
              query: $route.query,
            }"
          />
        </template>
      </CatalogPosterGrid>
    </AsyncState>
  </CatalogLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getMusicTracks } from '@/features/music/api'
import MusicTrackCard from '@/features/music/components/MusicTrackCard.vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import { useI18n } from '@/i18n'
import CatalogPosterGrid from '@/components/layout/CatalogPosterGrid.vue'
import CatalogLayout from '@/components/layout/CatalogLayout.vue'

const { t } = useI18n()

const query = useQuery({
  queryKey: ['music-tracks'],
  queryFn: () => getMusicTracks(50),
})

const tracks = computed(() => query.data.value ?? [])

const errorMessage = computed(() => {
  if (query.isError.value) return t.value.musicCatalog.errorLoadTracks
  if (!tracks.value.length) return t.value.musicCatalog.noTracks
  return ''
})
</script>

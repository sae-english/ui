<template>
  <div class="catalog">
    <PageSectionHeader
      :title="t.musicCatalog.title"
      :subtitle="t.musicCatalog.subtitle"
    />

    <el-main class="catalog__content">
      <div v-if="query.isLoading.value" class="catalog__loading content-loader-wrap">
        <ContentLoader :message="t.musicCatalog.loading" />
      </div>

      <el-empty
        v-else-if="query.isError.value || !tracks.length"
        :description="errorMessage"
      >
        <el-button type="primary" @click="query.refetch">
          {{ t.musicCatalog.retry }}
        </el-button>
      </el-empty>

      <section v-else class="catalog__section">
        <el-row :gutter="24" class="catalog__poster-list">
          <el-col
            v-for="item in tracks"
            :key="item.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            class="catalog__poster-item"
          >
            <MusicTrackCard
              :track="item"
              :to="{
                name: 'music-content',
                params: { id: item.id },
                query: $route.query,
              }"
            />
          </el-col>
        </el-row>
      </section>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { ElButton, ElEmpty, ElMain, ElRow, ElCol } from 'element-plus'
import { getMusicTracks } from '@/features/music/api'
import MusicTrackCard from '@/features/music/components/MusicTrackCard.vue'
import ContentLoader from '@/components/ui/ContentLoader.vue'
import { useI18n } from '@/i18n'
import PageSectionHeader from '@/components/layout/PageSectionHeader.vue'

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

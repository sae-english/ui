<template>
  <el-card
    class="poster-card"
    shadow="hover"
    body-style="padding: 0"
    @click="$emit('click')"
  >
    <div class="poster-card__image-wrap">
      <el-image
        :src="getPosterForTitle(series.name)"
        fit="cover"
        class="poster-card__image"
        loading="lazy"
      >
        <template #error>
          <div class="poster-card__placeholder">
            <el-icon :size="48"><VideoCameraFilled /></el-icon>
          </div>
        </template>
      </el-image>
      <el-tag size="small" type="success" effect="dark" round class="poster-card__badge">
        {{ t.common.series }}
      </el-tag>
    </div>
    <template #footer>
      <div class="poster-card__footer">
        <span class="poster-card__title">{{ series.name }}</span>
        <span class="poster-card__meta">{{ series.year }} · {{ series.director }}</span>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { VideoCameraFilled } from '@element-plus/icons-vue'
import { useI18n } from '@/i18n'
import { getPosterForTitle } from '@/utils/posters'
import type { SeriesDto } from '@/features/series/types'

const { t } = useI18n()

defineProps<{
  series: SeriesDto
}>()

defineEmits<{
  click: []
}>()
</script>

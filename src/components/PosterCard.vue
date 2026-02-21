<template>
  <el-card
    class="poster-card"
    shadow="hover"
    body-style="padding: 0"
    @click="$emit('click')"
  >
    <div class="poster-card__image-wrap">
      <el-image
        :src="getPosterForTitle(title.name)"
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
      <el-tag
        size="small"
        :type="title.type === 'MOVIE' ? 'warning' : 'success'"
        effect="dark"
        round
        class="poster-card__badge"
      >
        {{ title.type === 'MOVIE' ? 'Movie' : 'Series' }}
      </el-tag>
    </div>
    <template #footer>
      <div class="poster-card__footer">
        <span class="poster-card__title">{{ title.name }}</span>
        <span class="poster-card__meta">{{ title.year }} · {{ title.director }}</span>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { VideoCameraFilled } from '@element-plus/icons-vue'
import { getPosterForTitle } from '@/utils/posters'
import type { TitleDto } from '@/types/movie'

defineProps<{
  title: TitleDto
}>()

defineEmits<{
  click: []
}>()
</script>

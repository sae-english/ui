<template>
  <RouterLink :to="to" class="music-card-link">
    <el-card shadow="hover" class="music-card" :body-style="{ padding: '16px 18px' }">
      <div class="music-card__content">
        <h3 class="music-card__title">{{ track.name }}</h3>
        <p class="music-card__meta">
          <span v-if="track.performer">{{ track.performer }}</span>
          <span v-if="track.year">· {{ track.year }}</span>
        </p>
        <p v-if="track.description" class="music-card__desc">
          {{ track.description }}
        </p>
      </div>
    </el-card>
  </RouterLink>
</template>

<script setup lang="ts">
import { ElCard } from 'element-plus'
import type { MusicTrackDto } from '@/features/music/types'
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  track: MusicTrackDto
  to: RouteLocationRaw
}>()
</script>

<style scoped>
.music-card-link {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.music-card {
  border-radius: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}

.music-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.music-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 0;
}

.music-card__title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-word;
}

.music-card__meta {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-card__desc {
  margin: 0;
  margin-top: auto;
  font-size: 13px;
  color: var(--el-text-color-regular);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  word-break: break-word;
}
</style>


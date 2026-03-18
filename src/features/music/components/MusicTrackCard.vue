<template>
  <RouterLink :to="to" class="music-card-link">
    <el-card shadow="hover" class="music-card" body-style="{ padding: '16px 18px' }">
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
  display: block;
  text-decoration: none;
  color: inherit;
}

.music-card {
  border-radius: 12px;
}

.music-card__title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
}

.music-card__meta {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.music-card__desc {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-regular);
}
</style>


<template>
  <RouterLink :to="to" class="music-card">
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
  </RouterLink>
</template>

<script setup lang="ts">
import type { MusicTrackDto } from '@/features/music/types'

defineProps<{
  track: MusicTrackDto
  to: { name: string; params?: Record<string, unknown>; query?: Record<string, unknown> }
}>()
</script>

<style scoped>
.music-card {
  display: block;
  padding: 16px 18px;
  border-radius: 12px;
  background: var(--el-bg-color-overlay);
  box-shadow: var(--el-box-shadow-light);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.music-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--el-box-shadow);
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


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
        {{ title.type === 'MOVIE' ? 'Фильм' : 'Сериал' }}
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

<style scoped>
.poster-card {
  cursor: pointer;
  border-radius: 14px !important;
  overflow: hidden;
  border: 1px solid var(--fe-border);
  background: var(--fe-bg-card);
  transition:
    transform var(--fe-transition-smooth),
    box-shadow var(--fe-transition-normal),
    border-color var(--fe-transition-fast);
}

.poster-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--fe-shadow-lg);
  border-color: var(--fe-border-strong);
}

.poster-card:hover .poster-card__title {
  color: var(--fe-accent);
}

.poster-card__image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  background: var(--fe-bg-elevated);
}

.poster-card__image {
  width: 100%;
  height: 100%;
}

.poster-card__image :deep(.el-image__inner) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--fe-transition-normal);
}

.poster-card:hover .poster-card__image :deep(.el-image__inner) {
  transform: scale(1.03);
}

.poster-card__badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

.poster-card__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--fe-bg-elevated);
  color: var(--fe-text-muted);
}

.poster-card__footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 0 0;
}

.poster-card__title {
  font-family: var(--fe-font-heading);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--fe-text-primary);
  line-height: 1.3;
  transition: color var(--fe-transition-fast);
}

.poster-card__meta {
  font-size: 0.9rem;
  color: var(--fe-text-muted);
}
</style>

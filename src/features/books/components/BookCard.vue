<template>
  <el-card
    class="poster-card poster-card--book"
    shadow="hover"
    body-style="padding: 0"
    @click="$emit('click')"
  >
    <div class="poster-card__image-wrap">
      <div class="poster-card__placeholder poster-card__placeholder--book">
        <el-icon :size="48"><Reading /></el-icon>
      </div>
      <el-tag size="small" type="success" effect="dark" round class="poster-card__badge">
        {{ t.common.book }}
      </el-tag>
    </div>
    <template #footer>
      <div class="poster-card__footer">
        <span class="poster-card__title">{{ book.name }}</span>
        <span class="poster-card__meta">{{ book.year }} · {{ book.author }}</span>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { Reading } from '@element-plus/icons-vue'
import { useI18n } from '@/i18n'
import type { BookDto } from '@/features/books/types'

const { t } = useI18n()

defineProps<{
  book: BookDto
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.poster-card__placeholder--book {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  background: linear-gradient(135deg, #1e3a2f 0%, #0f1f18 100%);
  color: var(--el-color-success-light-3);
}
</style>

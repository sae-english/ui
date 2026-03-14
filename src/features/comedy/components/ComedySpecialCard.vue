<template>
  <el-card
    class="poster-card poster-card--comedy"
    shadow="hover"
    body-style="padding: 0"
    @click="$emit('click')"
  >
    <div class="poster-card__image-wrap">
      <div class="poster-card__placeholder poster-card__placeholder--comedy">
        <el-icon :size="48"><Microphone /></el-icon>
      </div>
      <el-tag size="small" type="warning" effect="dark" round class="poster-card__badge">
        {{ t.common.comedy }}
      </el-tag>
    </div>
    <template #footer>
      <div class="poster-card__footer">
        <span class="poster-card__title">{{ special.name }}</span>
        <span class="poster-card__meta">{{ special.year }} · {{ special.performer }}</span>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { Microphone } from '@element-plus/icons-vue'
import { useI18n } from '@/i18n'
import type { ComedySpecialDto } from '@/features/comedy/types'

const { t } = useI18n()

defineProps<{
  special: ComedySpecialDto
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.poster-card__placeholder--comedy {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
  color: var(--el-color-warning-light-3);
}
</style>

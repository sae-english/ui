<template>
  <el-button
    class="back-button"
    :icon="ArrowLeftBold"
    text
    @click="$emit('click')"
  >
    {{ label }}
  </el-button>
</template>

<script setup lang="ts">
import { ArrowLeftBold } from '@element-plus/icons-vue'

defineProps<{
  label: string
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <el-space class="content-loader" direction="vertical" alignment="center" :size="12">
    <el-icon class="is-loading" :size="iconSize"><component :is="icon" /></el-icon>
    <el-text type="info">{{ message }}</el-text>
  </el-space>
</template>

<script setup lang="ts">
import { VideoCameraFilled } from '@element-plus/icons-vue'
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    message: string
    icon?: Component
    iconSize?: number
  }>(),
  { icon: () => VideoCameraFilled, iconSize: 40 },
)
</script>

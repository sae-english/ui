<template>
  <el-card class="episode-hero" shadow="never" body-style="padding: 20px 24px">
    <el-space direction="vertical" :size="14" alignment="flex-start">
      <el-tag size="large" type="primary" effect="dark" round>
        #{{ episodeId }}
      </el-tag>
      <el-text tag="h1" class="episode-hero__title">{{ title }}</el-text>
    </el-space>
  </el-card>
</template>

<script setup lang="ts">
defineProps<{
  episodeId: string
  title: string
}>()
</script>

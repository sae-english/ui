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

<style scoped>
.episode-hero {
  margin-bottom: 28px;
  background: var(--fe-bg-card);
  border: 1px solid var(--fe-border);
  border-radius: 14px;
}

.episode-hero__title {
  font-family: var(--fe-font-heading);
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--fe-text-primary);
  letter-spacing: -0.01em;
}
</style>

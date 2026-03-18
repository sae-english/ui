<template>
  <div class="catalog">
    <PageSectionHeader :title="title" :subtitle="subtitle" />
    <el-main class="catalog__content">
      <slot />
    </el-main>
  </div>
</template>

<script setup lang="ts">
import PageSectionHeader from '@/components/layout/PageSectionHeader.vue'

defineProps<{
  title: string
  subtitle?: string
}>()
</script>


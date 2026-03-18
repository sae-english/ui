<template>
  <section class="catalog__section">
    <h2 v-if="sectionTitle" class="catalog__section-title">
      {{ sectionTitle }}
    </h2>

    <el-row :gutter="gutter" class="catalog__poster-list">
      <el-col
        v-for="item in items"
        :key="itemKey(item)"
        :xs="xs"
        :sm="sm"
        :md="md"
        :lg="lg"
        class="catalog__poster-item"
      >
        <slot name="item" :item="item" />
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items: any[]
    itemKey: (item: any) => string | number
    sectionTitle?: string | null
    xs: number
    sm: number
    md: number
    lg: number
    gutter?: number
  }>(),
  {
    gutter: 24,
    sectionTitle: null,
  },
)
</script>


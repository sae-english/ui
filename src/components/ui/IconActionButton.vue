<template>
  <el-button
    :type="type"
    :icon="icon"
    :icon-size="iconSize"
    :circle="circle"
    :title="title"
    :disabled="disabled"
    :loading="loading"
    :class="active && activeClass ? activeClass : undefined"
    @click="$emit('click', $event)"
  >
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

withDefaults(defineProps<{
  icon?: Component
  iconSize?: number
  title?: string
  type?: string
  circle?: boolean
  disabled?: boolean
  loading?: boolean
  active?: boolean
  activeClass?: string
}>(), {
  type: 'text',
  iconSize: 16,
  circle: false,
  disabled: false,
  loading: false,
  active: false,
  activeClass: '',
})

defineEmits<{
  click: [MouseEvent]
}>()
</script>


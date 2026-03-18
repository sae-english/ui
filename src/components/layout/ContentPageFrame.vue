<template>
  <el-container :class="containerClass" direction="vertical">
    <el-header :class="headerClass" height="auto">
      <slot name="header" />
    </el-header>
    <el-main :class="mainClass">
      <slot />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
defineProps<{
  containerClass: string
  headerClass: string
  mainClass: string
}>()
</script>


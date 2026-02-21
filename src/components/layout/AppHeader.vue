<template>
  <header class="app__header">
    <RouterLink :to="to('/')" class="app__logo">
      <el-icon class="app__logo-icon"><VideoCameraFilled /></el-icon>
      <span class="app__logo-text">{{ appTitle }}</span>
    </RouterLink>
    <nav class="app__nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="to(item.path)"
        class="app__nav-link"
        :class="{ 'app__nav-link--active': isActive(item.path) }"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="app__actions">
      <el-select
        :model-value="language"
        class="app__lang-select"
        size="default"
        @update:model-value="$emit('update:language', $event)"
      >
        <el-option
          v-for="opt in languageOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { VideoCameraFilled } from '@element-plus/icons-vue'
import { useLanguage } from '@/composables/useLanguage'
import type { StudyLanguage } from '@/types/language'

const route = useRoute()
const { to } = useLanguage()

defineProps<{
  language: StudyLanguage
  languageOptions: { value: StudyLanguage; label: string }[]
  navItems: { path: string; label: string }[]
  appTitle: string
}>()

defineEmits<{
  'update:language': [value: StudyLanguage]
}>()

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

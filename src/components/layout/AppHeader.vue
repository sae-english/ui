<template>
  <header class="app__header">
    <RouterLink :to="to('/')" class="app__logo" @click.prevent="goHome">
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
        @click.prevent="goTo(item.path)"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="app__actions">
      <el-tooltip :content="settingsLabel" placement="bottom">
        <RouterLink
          :to="to('/settings')"
          class="app__settings-btn"
          :class="{ 'app__settings-btn--active': isActive('/settings') }"
          @click.prevent="goTo('/settings')"
        >
          <el-icon :size="20"><Setting /></el-icon>
        </RouterLink>
      </el-tooltip>
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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VideoCameraFilled, Setting } from '@element-plus/icons-vue'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import type { StudyLanguage } from '@/types/language'

const route = useRoute()
const router = useRouter()
const { to } = useLanguage()
const { t } = useI18n()

defineProps<{
  language: StudyLanguage
  languageOptions: { value: StudyLanguage; label: string }[]
  navItems: { path: string; label: string }[]
  appTitle: string
}>()

const settingsLabel = computed(() => t.value.settings.title)

defineEmits<{
  'update:language': [value: StudyLanguage]
}>()

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function goHome() {
  router.push(to('/'))
}

function goTo(path: string) {
  router.push(to(path))
}
</script>

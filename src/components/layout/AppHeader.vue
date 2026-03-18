<template>
  <header class="app__header">
    <RouterLink :to="to('/')" class="app__logo" @click.prevent="goHome">
      <el-icon class="app__logo-icon"><VideoCameraFilled /></el-icon>
      <span class="app__logo-text">{{ appTitle }}</span>
    </RouterLink>
    <nav class="app__nav">
      <NavLink
        v-for="item in navItems"
        :key="item.path"
        :to="to(item.path)"
        :path-for-active="item.path"
        base-class="app__nav-link"
        active-class="app__nav-link--active"
      >
        {{ item.label }}
      </NavLink>
    </nav>
    <div class="app__actions">
      <el-tooltip :content="settingsLabel" placement="bottom">
        <NavLink
          :to="to('/settings')"
          path-for-active="/settings"
          base-class="app__settings-btn"
          active-class="app__settings-btn--active"
        >
          <el-icon :size="20"><Setting /></el-icon>
        </NavLink>
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
import { useRouter } from 'vue-router'
import { VideoCameraFilled, Setting } from '@element-plus/icons-vue'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import type { StudyLanguage } from '@/types/language'
import NavLink from '@/components/layout/NavLink.vue'

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

function goHome() {
  router.push(to('/'))
}
</script>

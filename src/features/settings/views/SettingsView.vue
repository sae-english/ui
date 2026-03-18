<template>
  <div class="settings">
    <PageSectionHeader
      :title="t.settings.title"
      :subtitle="t.settings.subtitle"
    />

    <el-main class="settings__content">
      <AsyncState
        :is-loading="loading"
        :has-data="true"
        :error-message="error"
        :retry-label="t.dictionary.retry"
        :loading-message="t.common.loading"
        @retry="load"
      >
        <template #loading>
          <div class="settings__loading content-loader-wrap">
            <ContentLoader :message="t.common.loading" :icon-size="36" />
          </div>
        </template>

        <template #error="{ onRetry }">
          <div class="settings__error">
            <el-alert type="error" :description="error" show-icon />
            <el-button type="primary" class="settings__retry" @click="onRetry">
              {{ t.dictionary.retry }}
            </el-button>
          </div>
        </template>

        <el-card
          class="settings__card"
          shadow="never"
          body-style="{ padding: '1.25rem 1.5rem' }"
        >
          <div class="settings__row">
            <div class="settings__label-wrap">
              <span class="settings__label">{{ t.settings.telegramSending }}</span>
              <el-text type="info" size="small" class="settings__hint">
                {{ t.settings.telegramSendingHint }}
              </el-text>
            </div>
            <el-switch
              :model-value="telegramSendingEnabled"
              :loading="saving"
              @update:model-value="onToggle"
            />
          </div>
        </el-card>
      </AsyncState>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from '@/i18n'
import ContentLoader from '@/components/ui/ContentLoader.vue'
import PageSectionHeader from '@/components/layout/PageSectionHeader.vue'
import AsyncState from '@/components/ui/AsyncState.vue'
import {
  getTelegramSendingEnabled,
  setTelegramSendingEnabled,
} from '@/services/api'

const { t } = useI18n()

const telegramSendingEnabled = ref(false)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null
  try {
    const data = await getTelegramSendingEnabled()
    telegramSendingEnabled.value = data.enabled
  } catch (e) {
    console.error(e)
    error.value = t.value.settings.failedLoad
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

async function onToggle(enabled: boolean) {
  saving.value = true
  try {
    const data = await setTelegramSendingEnabled(enabled)
    telegramSendingEnabled.value = data.enabled
    ElMessage.success(t.value.settings.saved)
  } catch (e) {
    console.error(e)
    ElMessage.error(t.value.settings.failedSave)
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.settings__content {
  max-width: 560px;
}
.settings__loading,
.settings__error {
  padding: 1.5rem 0;
}
.settings__retry {
  margin-top: 0.75rem;
}
.settings__card {
  border-radius: 8px;
}
.settings__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.settings__label-wrap {
  flex: 1;
  min-width: 0;
}
.settings__label {
  font-weight: 500;
  display: block;
}
.settings__hint {
  display: block;
  margin-top: 0.25rem;
}
</style>

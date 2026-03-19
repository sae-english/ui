<template>
  <div class="settings">
    <el-main class="settings__content">
      <AsyncState
        :is-loading="query.isLoading.value"
        :has-data="true"
        :error-message="query.isError.value ? t.settings.failedLoad : null"
        :retry-label="t.dictionary.retry"
        :loading-message="t.common.loading"
        @retry="query.refetch"
      >
        <template #loading>
          <div class="settings__loading content-loader-wrap">
            <ContentLoader :message="t.common.loading" :icon-size="36" />
          </div>
        </template>

        <template #error="{ onRetry }">
          <div class="settings__error">
            <el-alert type="error" :description="t.settings.failedLoad" show-icon />
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
              <span class="settings__label">{{
                t.settings.telegramSending
              }}</span>
              <el-text type="info" size="small" class="settings__hint">
                {{ t.settings.telegramSendingHint }}
              </el-text>
            </div>
            <el-switch
              :model-value="telegramSendingEnabled"
              :loading="toggleMutation.isPending.value"
              :disabled="toggleMutation.isPending.value || intervalMutation.isPending.value"
              @update:model-value="onToggle"
            />
          </div>

          <div class="settings__row settings__row--mt">
            <div class="settings__label-wrap">
              <span class="settings__label">{{
                t.settings.telegramSendingIntervalMinutes
              }}</span>
              <el-text type="info" size="small" class="settings__hint">
                {{ t.settings.telegramSendingIntervalHint }}
              </el-text>
            </div>

            <el-input-number
              v-model="telegramSendingIntervalMinutes"
              :min="1"
              :disabled="!telegramSendingEnabled || intervalMutation.isPending.value || toggleMutation.isPending.value"
              :step="1"
              :precision="0"
              @change="onIntervalChange"
            />
          </div>
        </el-card>
      </AsyncState>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { watchEffect, ref } from "vue";
import { ElMessage } from "element-plus";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { useI18n } from "@/i18n";
import ContentLoader from "@/components/ui/ContentLoader.vue";
import AsyncState from "@/components/ui/AsyncState.vue";
import {
  getTelegramSendingEnabled,
  setTelegramSendingEnabled,
  setTelegramSendingIntervalMinutes,
} from "@/services/api";

const { t } = useI18n();
const queryClient = useQueryClient();

const telegramSendingEnabled = ref(false);
const telegramSendingIntervalMinutes = ref(60);

const query = useQuery({
  queryKey: ["settings", "telegram-sending"],
  queryFn: async () => {
    const data = await getTelegramSendingEnabled();
    return data;
  },
});

const toggleMutation = useMutation({
  mutationFn: (enabled: boolean) => setTelegramSendingEnabled(enabled),
  onSuccess: (data) => {
    queryClient.setQueryData(["settings", "telegram-sending"], data);
    telegramSendingEnabled.value = data.enabled;
    telegramSendingIntervalMinutes.value = data.intervalMinutes;
    ElMessage.success(t.value.settings.saved);
  },
  onError: (e) => {
    console.error(e);
    ElMessage.error(t.value.settings.failedSave);
  },
});

const intervalMutation = useMutation({
  mutationFn: (minutes: number) => setTelegramSendingIntervalMinutes(minutes),
  onSuccess: (data) => {
    queryClient.setQueryData(["settings", "telegram-sending"], data);
    telegramSendingEnabled.value = data.enabled;
    telegramSendingIntervalMinutes.value = data.intervalMinutes;
    ElMessage.success(t.value.settings.saved);
  },
  onError: (e) => {
    console.error(e);
    ElMessage.error(t.value.settings.failedSave);
  },
});

watchEffect(() => {
  const data = query.data.value;
  if (!data) return;
  telegramSendingEnabled.value = data.enabled;
  telegramSendingIntervalMinutes.value = data.intervalMinutes;
});

async function onToggle(enabled: boolean) {
  await toggleMutation.mutateAsync(enabled);
}

async function onIntervalChange(minutes: number | null) {
  if (!telegramSendingEnabled.value) return;
  if (minutes == null) return;
  await intervalMutation.mutateAsync(minutes);
}
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
.settings__row--mt {
  margin-top: 1rem;
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

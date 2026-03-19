<template>
  <section class="test-mode">
    <div class="test-mode__content">
      <AsyncState
        class="test-mode__async-state"
        :is-loading="query.isLoading.value"
        :has-data="!!entry"
        :error-message="query.isError.value ? t.dictionary.testMode.failedLoad : null"
        :empty-description="t.dictionary.testMode.empty"
        :loading-message="t.common.loading"
        :retry-label="t.dictionary.retry"
        @retry="loadNextEntry"
      >
        <button
          type="button"
          class="test-card"
          :class="{ 'test-card--flipped': isFlipped }"
          @click="onCardClick"
          :aria-label="isFlipped ? 'Show word value' : 'Show translation'"
        >
          <span class="test-card__face test-card__face--front">
            {{ entry!.value }}
          </span>
          <span class="test-card__face test-card__face--back">
            {{ entry!.translation }}
          </span>
        </button>

        <el-button
          type="primary"
          class="test-mode__next-btn"
          :loading="query.isFetching.value && !query.isLoading.value"
          :disabled="query.isFetching.value"
          @click="loadNextEntry"
        >
          {{ t.dictionary.testMode.nextWord }}
        </el-button>
      </AsyncState>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useLanguage } from '@/composables/useLanguage'
import { findNextForTesting, type DictionaryDto } from '@/services/api'
import { useI18n } from '@/i18n'
import AsyncState from '@/components/ui/AsyncState.vue'

const { language } = useLanguage()
const { t } = useI18n()

const langParam = computed(() => (language.value === 'hy' ? 'ARMENIAN' : 'ENGLISH'))
const isFlipped = ref(false)
const refreshKey = ref(0)

async function loadNextEntry() {
  isFlipped.value = false
  refreshKey.value += 1
  await query.refetch()
}

const query = useQuery<DictionaryDto | null>({
  queryKey: computed(
    () => ['dictionary', 'test-mode', 'next-for-testing', langParam.value, refreshKey.value] as const,
  ),
  queryFn: () => findNextForTesting(langParam.value),
})

const entry = computed(() => query.data.value ?? null)

function onCardClick(event: MouseEvent) {
  isFlipped.value = !isFlipped.value
  ;(event.currentTarget as HTMLButtonElement | null)?.blur()
}
</script>

<style scoped>
.test-mode {
  width: 100%;
  overflow-x: hidden;
  padding: 0 16px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}

.test-mode__content {
  width: 100%;
  min-height: calc(100vh - 220px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.test-mode__async-state {
  width: 100%;
  max-width: 560px;
}

.test-mode__async-state :deep(.async-state) {
  width: 100%;
}

.test-mode__state {
  color: var(--el-text-color-secondary);
  text-align: center;
}

.test-mode__state--error {
  color: var(--el-color-danger);
}

.test-mode__next-btn {
  width: 100%;
  margin-top: 2px;
}

.test-card {
  width: 100%;
  min-height: 220px;
  position: relative;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 18px;
  background: transparent;
  padding: 0;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.28);
}

.test-card:hover {
  transform: translateY(-2px);
}

.test-card--flipped {
  transform: rotateY(180deg);
}

.test-card--flipped:hover {
  transform: rotateY(180deg) translateY(-2px);
}

.test-card__face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-x: hidden;
  backface-visibility: hidden;
  border-radius: 18px;
  font-size: clamp(1.4rem, 3.5vw, 2.2rem);
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: normal;
  hyphens: auto;
}

.test-card__face--front {
  background: linear-gradient(140deg, rgba(79, 156, 249, 0.24), rgba(79, 156, 249, 0.08));
  color: var(--fe-text-primary);
}

.test-card__face--back {
  background: linear-gradient(140deg, rgba(16, 185, 129, 0.24), rgba(16, 185, 129, 0.08));
  color: var(--fe-text-primary);
  transform: rotateY(180deg);
}

@media (max-width: 420px) {
  .test-mode {
    padding: 0 12px 28px;
  }

  .test-card {
    min-height: 190px;
  }

  .test-card__face {
    padding: 16px;
  }

}

@media (max-width: 360px) {
  .test-card {
    min-height: 176px;
    border-radius: 14px;
  }

  .test-card__face {
    border-radius: 14px;
    font-size: clamp(1.1rem, 6.2vw, 1.5rem);
    line-height: 1.35;
  }
}
</style>


<template>
  <div class="async-state">
    <div v-if="isLoading" class="async-state__loading">
      <slot name="loading">
        <div :class="loadingWrapperClassComputed">
          <ContentLoader
            :message="loadingMessage"
            :icon="loadingIcon"
            :icon-size="loadingIconSize"
          />
        </div>
      </slot>
    </div>

    <template v-else>
      <div v-if="errorMessage" class="async-state__error">
        <slot name="error" :onRetry="onRetry">
          <el-empty :description="errorMessage">
            <el-button
              v-if="retryLabel"
              type="primary"
              @click="onRetry"
            >
              {{ retryLabel }}
            </el-button>
          </el-empty>
        </slot>
      </div>

      <div v-else-if="!hasData" class="async-state__empty">
        <slot name="empty">
          <el-empty :description="emptyDescription" />
        </slot>
      </div>

      <slot />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import ContentLoader from '@/components/ui/ContentLoader.vue'

defineOptions({ name: 'AsyncState' })

const props = withDefaults(
  defineProps<{
    isLoading: boolean
    hasData: boolean
    errorMessage?: string | null
    emptyDescription?: string
    retryLabel?: string
    loadingMessage: string
    loadingIcon?: Component
    loadingIconSize?: number
    loadingWrapperClass?: string
  }>(),
  {
    errorMessage: null,
    emptyDescription: '',
    retryLabel: '',
    loadingIconSize: 40,
    loadingWrapperClass: 'layout-loading-center',
  },
)

const emit = defineEmits<{
  retry: []
}>()

function onRetry() {
  emit('retry')
}

const loadingMessage = computed(() => props.loadingMessage)
const loadingIcon = computed(() => props.loadingIcon)
const loadingIconSize = computed(() => props.loadingIconSize)
const loadingWrapperClassComputed = computed(() => props.loadingWrapperClass)
</script>

<style scoped>
.async-state__loading {
  min-width: 0;
}
</style>


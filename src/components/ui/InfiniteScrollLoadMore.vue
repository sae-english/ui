<template>
  <div
    v-if="hasNextPage || isFetchingNextPage"
    ref="sentinelRef"
    class="infinite-scroll-load-more"
  >
    <el-button
      v-if="canLoadMore"
      type="primary"
      :loading="isFetchingNextPage"
      @click="requestLoadMore"
    >
      {{ buttonLabel }}
    </el-button>
    <ContentLoader
      v-else-if="isFetchingNextPage"
      :message="loadingLabel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useI18n } from "@/i18n";
import ContentLoader from "@/components/ui/ContentLoader.vue";
import { INFINITE_SCROLL_ROOT_MARGIN } from "@/constants/defaults";

const { t } = useI18n();

const props = defineProps<{
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  loadingLabel?: string;
  buttonLabel?: string;
}>();

const emit = defineEmits<{
  loadMore: [];
}>();

const sentinelRef = ref<HTMLElement | null>(null);

const canLoadMore = computed(() => props.hasNextPage && !props.isFetchingNextPage);

const loadingLabel = computed(() => props.loadingLabel ?? t.common.loading);
const buttonLabel = computed(() => props.buttonLabel ?? t.common.loadMore);

function requestLoadMore() {
  if (!canLoadMore.value) return;
  emit("loadMore");
}

useIntersectionObserver(
  sentinelRef,
  ([entry]) => {
    if (entry?.isIntersecting && canLoadMore.value) emit("loadMore");
  },
  { rootMargin: INFINITE_SCROLL_ROOT_MARGIN, threshold: 0 },
);
</script>

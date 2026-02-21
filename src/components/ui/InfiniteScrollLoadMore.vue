<template>
  <div
    v-if="hasNextPage || isFetchingNextPage"
    ref="sentinelRef"
    class="infinite-scroll-load-more"
  >
    <el-button
      v-if="hasNextPage && !isFetchingNextPage"
      type="primary"
      :loading="isFetchingNextPage"
      @click="$emit('loadMore')"
    >
      {{ t.common.loadMore }}
    </el-button>
    <ContentLoader
      v-else-if="isFetchingNextPage"
      :message="t.common.loading"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useI18n } from "@/i18n";
import ContentLoader from "@/components/ui/ContentLoader.vue";
import { INFINITE_SCROLL_ROOT_MARGIN } from "@/constants/defaults";

const { t } = useI18n();

const props = defineProps<{
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}>();

const emit = defineEmits<{
  loadMore: [];
}>();

const sentinelRef = ref<HTMLElement | null>(null);

useIntersectionObserver(
  sentinelRef,
  ([entry]) => {
    if (
      entry?.isIntersecting &&
      props.hasNextPage &&
      !props.isFetchingNextPage
    ) {
      emit("loadMore");
    }
  },
  { rootMargin: INFINITE_SCROLL_ROOT_MARGIN, threshold: 0 },
);
</script>

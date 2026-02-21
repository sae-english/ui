<template>
  <el-container class="movie-content" direction="vertical">
    <el-header class="movie-content__header" height="auto">
      <BackButton :label="t.movieContent.backToMovies" @click="goBack" />
    </el-header>

    <el-main class="movie-content__main">
      <div v-if="query.isLoading.value" class="content-loader-wrap">
        <ContentLoader :message="t.movieContent.loadingScript" />
      </div>

      <template v-else-if="blocks.length > 0 || hasLoadedOnce">
        <el-main class="movie-content__content">
          <PhraseAddButton :content-key="contentKey" content-type="MOVIE">
            <EpisodeScript :blocks="blocks" />
          </PhraseAddButton>
        </el-main>

        <InfiniteScrollLoadMore
          :has-next-page="query.hasNextPage.value"
          :is-fetching-next-page="query.isFetchingNextPage.value"
          class="movie-content__load-more"
          @load-more="query.fetchNextPage()"
        />
      </template>

      <el-empty v-else :description="t.movieContent.contentNotFound" />
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { ElMessage } from "element-plus";
import {
  getMovieContentPage,
  contentBlockToTranscriptBlock,
} from "@/features/movies/api";
import BackButton from "@/components/ui/BackButton.vue";
import { useLanguage } from "@/composables/useLanguage";
import { useI18n } from "@/i18n";
import type { TranscriptBlock } from "@/types/movie";
import ContentLoader from "@/components/ui/ContentLoader.vue";
import InfiniteScrollLoadMore from "@/components/ui/InfiniteScrollLoadMore.vue";
import EpisodeScript from "@/components/script/EpisodeScript.vue";
import PhraseAddButton from "@/components/script/PhraseAddButton.vue";
import { DEFAULT_PAGE_SIZE } from "@/constants/defaults";

const route = useRoute();
const router = useRouter();
const { navQuery } = useLanguage();
const { t } = useI18n();

const movieId = computed(() => {
  const id = route.params.movieId;
  return typeof id === "string" ? parseInt(id, 10) : Number(id);
});

const query = useInfiniteQuery({
  queryKey: computed(() => ["movie-content", movieId.value] as const),
  queryFn: async ({ pageParam }) => {
    const id = movieId.value;
    const page = await getMovieContentPage(id, {
      after: pageParam ?? undefined,
      limit: DEFAULT_PAGE_SIZE,
    });
    if (!page) throw new Error("Content not found");
    return page;
  },
  initialPageParam: null as string | null,
  getNextPageParam: (lastPage) =>
    lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  enabled: computed(() => {
    const id = movieId.value;
    return !!id && !isNaN(id);
  }),
});

const blocks = computed<TranscriptBlock[]>(() => {
  const pages = query.data.value?.pages ?? [];
  return pages.flatMap((p) =>
    (p.content ?? []).map(contentBlockToTranscriptBlock),
  );
});

const firstPage = computed(() => query.data.value?.pages[0]);
const contentKey = computed(() => firstPage.value?.contentKey ?? undefined);
const hasLoadedOnce = computed(
  () => (query.data.value?.pages?.length ?? 0) > 0,
);
const errorMessage = computed(
  () =>
    (query.error.value as Error | null)?.message ??
    t.value.movieContent.failedLoadScript,
);

watch(
  () => query.isError.value,
  (isErr) => {
    if (isErr) ElMessage.error(errorMessage.value);
  },
);

function goBack() {
  router.push({
    name: "catalog",
    query: navQuery(),
  });
}
</script>

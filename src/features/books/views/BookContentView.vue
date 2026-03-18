<template>
  <el-container class="book-content" direction="vertical">
    <el-header class="book-content__header" height="auto">
      <div class="book-content__header-inner">
        <BackButton :label="t.bookContent.backToBooks" @click="goBack" />
        <button
          v-if="bookmark"
          type="button"
          class="book-content__bookmark-jump"
          :title="t.bookContent.goToBookmark"
          @click="goToBookmark"
        >
          ★
        </button>
      </div>
    </el-header>

    <el-main class="book-content__main">
      <AsyncState
        :is-loading="query.isLoading.value"
        :has-data="hasLoadedOnce"
        :error-message="query.isError.value ? errorMessage : null"
        :retry-label="t.bookCatalog.retry"
        :empty-description="t.bookContent.contentNotFound"
        :loading-message="t.bookContent.loadingContent"
        loading-wrapper-class="content-loader-wrap"
        @retry="goBack"
      >
        <div class="book-content__content">
          <div class="book-content__hero">
            <h1 class="book-content__title">{{ firstPage?.name }}</h1>
            <p class="book-content__meta">
              {{ firstPage?.author }} · {{ firstPage?.year }}
            </p>
            <p v-if="firstPage?.description" class="book-content__desc">
              {{ firstPage.description }}
            </p>
            <el-collapse
              v-if="sections.length"
              class="book-content__toc"
              accordion
            >
              <el-collapse-item
                :title="t.bookContent.tableOfContents"
                name="toc"
              >
                <nav aria-label="Table of contents">
                  <ul class="book-content__toc-list">
                    <li
                      v-for="(s, i) in sections"
                      :key="s.id ?? s.title ?? i"
                      class="book-content__toc-item"
                    >
                      <RouterLink
                        v-if="s.id"
                        :to="{
                          name: 'book-chapter',
                          params: { id, sectionId: s.id },
                          query: $route.query,
                        }"
                        class="book-content__toc-link"
                      >
                        {{ s.title || s.id }}
                      </RouterLink>
                      <span v-else class="book-content__toc-plain">{{
                        s.title
                      }}</span>
                    </li>
                  </ul>
                </nav>
              </el-collapse-item>
            </el-collapse>
          </div>
          <PhraseAddButton :content-key="contentKey" content-type="BOOK">
            <EpisodeScript :blocks="blocks" :highlight-quotes="true" />
          </PhraseAddButton>
        </div>

        <InfiniteScrollLoadMore
          :has-next-page="query.hasNextPage.value"
          :is-fetching-next-page="query.isFetchingNextPage.value"
          class="book-content__load-more"
          @load-more="query.fetchNextPage()"
        />
      </AsyncState>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ElCollapse, ElCollapseItem } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import BackButton from "@/components/ui/BackButton.vue";
import { useLanguage } from "@/composables/useLanguage";
import { useI18n } from "@/i18n";
import InfiniteScrollLoadMore from "@/components/ui/InfiniteScrollLoadMore.vue";
import EpisodeScript from "@/components/script/EpisodeScript.vue";
import PhraseAddButton from "@/components/script/PhraseAddButton.vue";
import { useBookContent } from "@/features/books/useBookContent";
import AsyncState from "@/components/ui/AsyncState.vue";

const { navQuery } = useLanguage();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const {
  id,
  query,
  blocks,
  firstPage,
  contentKey,
  hasLoadedOnce,
  sections,
  errorMessage,
  bookmark,
} = useBookContent();

function goBack() {
  // возвращаемся на каталог книг
  window.history.length > 1
    ? window.history.back()
    : (location.href = `${location.origin}${location.pathname}#/books?${new URLSearchParams(
        navQuery(),
      ).toString()}`);
}

function goToBookmark() {
  const value = bookmark?.value;
  if (!value) return;
  const { blockId, sectionId } = value;
  if (!blockId) return;

  const bookId = id.value;
  const queryObj = route.query;

  if (sectionId) {
    router.push({
      name: "book-chapter",
      params: { id: bookId, sectionId },
      query: queryObj,
      hash: `#${blockId}`,
    });
  } else {
    router.push({
      name: "book-content",
      params: { id: bookId },
      query: queryObj,
      hash: `#${blockId}`,
    });
  }
}
</script>

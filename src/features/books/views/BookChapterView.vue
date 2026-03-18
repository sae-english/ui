<template>
  <ContentPageFrame
    container-class="book-content"
    header-class="book-content__header"
    main-class="book-content__main"
  >
    <template #header>
      <div class="book-content__header-inner">
        <BackButton :label="t.bookContent.backToBooks" @click="goBack" />
        <IconActionButton
          v-if="bookmark"
          class="book-content__bookmark-jump"
          :title="t.bookContent.goToBookmark"
          @click="goToBookmark"
          :icon="Star"
          :icon-size="18"
          type="text"
        />
      </div>
    </template>

    <AsyncState
      :is-loading="query.isLoading.value"
      :has-data="chapterBlocks.length > 0"
      :error-message="query.isError.value ? errorMessage : null"
      :retry-label="t.bookCatalog.retry"
      :empty-description="t.bookContent.contentNotFound"
      :loading-message="t.bookContent.loadingContent"
      loading-wrapper-class="content-loader-wrap"
      @retry="goBack"
    >
      <div class="book-content__content">
        <div class="book-content__hero">
          <h1 class="book-content__title">{{ bookMeta?.name }}</h1>
          <p class="book-content__meta">
            {{ bookMeta?.author }} · {{ bookMeta?.year }}
          </p>
          <p v-if="bookMeta?.description" class="book-content__desc">
            {{ bookMeta.description }}
          </p>

          <el-collapse v-if="sections.length" class="book-content__toc" accordion>
            <el-collapse-item :title="t.bookContent.tableOfContents" name="toc">
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
                        params: { id: bookId, sectionId: s.id },
                        query: $route.query,
                      }"
                      class="book-content__toc-link"
                      :class="{ 'book-content__toc-link--active': s.id === sectionId }"
                    >
                      {{ s.title || s.id }}
                    </RouterLink>
                    <span v-else class="book-content__toc-plain">{{ s.title }}</span>
                  </li>
                </ul>
              </nav>
            </el-collapse-item>
          </el-collapse>
        </div>

        <PhraseAddButton :content-key="bookMeta?.contentKey" content-type="BOOK">
          <EpisodeScript :blocks="blocks" :highlight-quotes="true" />
        </PhraseAddButton>

        <div
          v-if="currentSection"
          class="book-content__chapter-nav"
          :class="{
            'book-content__chapter-nav--only-prev': prevSection && !nextSection,
            'book-content__chapter-nav--only-next': nextSection && !prevSection,
            'book-content__chapter-nav--both': prevSection && nextSection,
          }"
        >
          <el-button
            v-if="prevSection"
            size="large"
            text
            @click="goToSection(prevSection.id!)"
          >
            ← {{ prevSection.title }}
          </el-button>

          <el-button
            v-if="nextSection"
            size="large"
            type="primary"
            @click="goToSection(nextSection.id!)"
          >
            {{ nextSection.title }} →
          </el-button>
        </div>
      </div>
    </AsyncState>
  </ContentPageFrame>
</template>

<script setup lang="ts">
import { ElCollapse, ElCollapseItem } from 'element-plus'
import { Star } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import BackButton from '@/components/ui/BackButton.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import EpisodeScript from '@/components/script/EpisodeScript.vue'
import PhraseAddButton from '@/components/script/PhraseAddButton.vue'
import { useBookChapter } from '@/features/books/useBookChapter'
import AsyncState from '@/components/ui/AsyncState.vue'
import ContentPageFrame from '@/components/layout/ContentPageFrame.vue'
import IconActionButton from '@/components/ui/IconActionButton.vue'

const { navQuery } = useLanguage()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const {
  bookId,
  sectionId,
  query,
  bookMeta,
  chapterBlocks,
  sections,
  blocks,
  currentSection,
  prevSection,
  nextSection,
  errorMessage,
  bookmark,
  goToSection,
} = useBookChapter()

function goBack() {
  // возвращаемся на каталог книг
  window.history.length > 1
    ? window.history.back()
    : (location.href = `${location.origin}${location.pathname}#/books?${new URLSearchParams(
        navQuery(),
      ).toString()}`)
}

function goToBookmark() {
  if (!bookmark.value) return
  const { blockId, sectionId: targetSection } = bookmark.value
  if (!blockId) return
  const id = bookId.value
  const queryObj = route.query

  if (targetSection && targetSection !== sectionId.value) {
    router.push({
      name: 'book-chapter',
      params: { id, sectionId: targetSection },
      query: queryObj,
      hash: `#${blockId}`,
    })
  } else {
    router.push({
      name: 'book-chapter',
      params: { id, sectionId: sectionId.value },
      query: queryObj,
      hash: `#${blockId}`,
    })
  }
}
</script>

<style scoped>
.book-content__chapter-nav {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.book-content__chapter-nav--only-prev {
  justify-content: flex-start;
}

.book-content__chapter-nav--only-next {
  justify-content: flex-end;
}

.book-content__chapter-nav--both {
  justify-content: space-between;
}
</style>


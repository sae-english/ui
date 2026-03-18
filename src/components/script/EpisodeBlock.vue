<template>
  <!-- Section -->
  <div
    v-if="block.type === 'section'"
    class="episode-block episode-block--section"
    :id="blockIdAttr"
    :data-block-id="blockIdAttr"
  >
    <el-divider content-position="center">
      <el-tag type="info" effect="plain" size="small">
        {{ block.title }}
      </el-tag>
    </el-divider>
  </div>

  <!-- Scene -->
  <div
    v-else-if="block.type === 'scene'"
    class="episode-block episode-block--scene"
    :id="blockIdAttr"
    :data-block-id="blockIdAttr"
  >
    <el-card shadow="never" class="episode-block__scene-card" body-style="padding: 10px 14px">
      <el-space :size="10" wrap>
        <el-text tag="span" class="episode-block__scene-label">{{ t.common.scene }}</el-text>
        <el-text tag="span" type="info" class="episode-block__scene-desc">{{ block.description }}</el-text>
      </el-space>
    </el-card>
  </div>

  <!-- Dialogue -->
  <div
    v-else-if="block.type === 'dialogue'"
    class="episode-block episode-block--dialogue"
    :id="blockIdAttr"
    :data-block-id="blockIdAttr"
  >
    <el-card
      shadow="never"
      class="episode-block__dialogue"
      :class="{ 'episode-block__dialogue--uncut': block.isUncut }"
      body-style="padding: 16px 20px"
    >
      <el-space class="episode-block__dialogue-head" :size="10" wrap>
        <el-tag size="small" effect="plain" class="episode-block__dialogue-speaker">
          {{ block.speaker }}
          <el-text v-if="block.isUncut" size="small" class="episode-block__dialogue-uncut-flag"> ({{ t.common.extendedVersion }})</el-text>
        </el-tag>
        <el-text v-if="block.parenthetical" type="info" class="episode-block__dialogue-parenthetical">
          ({{ block.parenthetical }})
        </el-text>
      </el-space>
      <el-text tag="p" class="episode-block__dialogue-text">{{ block.text }}</el-text>
    </el-card>
  </div>

  <!-- Action -->
  <div
    v-else-if="block.type === 'action'"
    class="episode-block episode-block--action"
    :id="blockIdAttr"
    :data-block-id="blockIdAttr"
  >
    <el-text tag="p" type="info" class="episode-block__action">
      <em>({{ block.text }})</em>
    </el-text>
  </div>

  <!-- Transition -->
  <div
    v-else-if="block.type === 'transition'"
    class="episode-block episode-block--transition"
    :id="blockIdAttr"
    :data-block-id="blockIdAttr"
  >
    <el-text tag="p" type="info" class="episode-block__transition">{{ block.text }}</el-text>
  </div>

  <!-- Text (e.g. comedy stand-up or book paragraph); when highlightQuotes, direct speech in "..." is styled -->
  <div
    v-else-if="block.type === 'text'"
    class="episode-block episode-block--text"
    :id="blockIdAttr"
    :data-block-id="blockIdAttr"
    :class="{ 'episode-block--first-paragraph': block.firstInSection }"
  >
    <el-card
      shadow="never"
      class="episode-block__dialogue episode-block__text-card"
      body-style="padding: 16px 20px 14px"
    >
      <div v-if="showBookmarkButton" class="episode-block__toolbar">
        <el-button
          class="episode-block__bookmark-btn"
          :class="{ 'episode-block__bookmark-btn--active': isActiveBookmark }"
          type="text"
          :icon="Star"
          circle
          :title="t.common.saveBookmark"
          @click.stop="handleBookmarkClick"
        />
      </div>
      <el-text tag="p" class="episode-block__dialogue-text">
        <!-- Если есть spans (книга) — рендерим их, иначе старое поведение -->
        <template v-if="(block as any).spans && (block as any).spans.length">
          <span
            v-for="(span, i) in (block as any).spans"
            :key="i"
            :class="{
              'book-text--italic': span.style === 'italic' || span.style === 'italic-bold',
              'book-text--bold': span.style === 'bold' || span.style === 'italic-bold',
            }"
          >
            {{ i === 0 ? span.text : ' ' + span.text }}
          </span>
        </template>
        <template v-else-if="highlightQuotes">
          <template v-for="(seg, i) in textSegments" :key="i">
            <span v-if="seg.type === 'quote'" class="episode-block__quote">{{ seg.text }}</span>
            <template v-else>{{ seg.text }}</template>
          </template>
        </template>
        <template v-else>{{ block.text }}</template>
      </el-text>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElButton } from 'element-plus'
import { Star } from '@element-plus/icons-vue'
import { useI18n } from '@/i18n'
import { getQuoteSegments } from '@/utils/quoteSegments'
import { upsertBookBookmark, getBookBookmarkLocation } from '@/features/books/api'
import { useBookBookmarkStore } from '@/features/books/bookmarkStore'
import type { TranscriptBlock } from '@/types/movie'

const { t } = useI18n()
const route = useRoute()
const bookmarkStore = useBookBookmarkStore()

const props = withDefaults(
  defineProps<{
    block: TranscriptBlock
    index: number
    highlightQuotes?: boolean
  }>(),
  { highlightQuotes: false }
)

const blockIdAttr = computed(() => {
  const b = props.block
  if ('id' in b && b.id != null && b.id !== '') return String(b.id)
  return undefined
})

const textSegments = computed(() => {
  if (props.block.type !== 'text') return []
  return getQuoteSegments(props.block.text)
})

const showBookmarkButton = computed(() => {
  const routeName = route.name
  if (routeName !== 'book-content' && routeName !== 'book-chapter') return false
  return !!blockIdAttr.value
})

const isActiveBookmark = computed(() => {
  const blockId = blockIdAttr.value
  if (!blockId) return false
  const rawId = route.params.id
  const bookId = rawId != null ? Number(rawId) : NaN
  if (!bookId || Number.isNaN(bookId)) return false
  return bookmarkStore.byBookId[bookId]?.blockId === blockId
})

function handleBookmarkClick() {
  const blockId = blockIdAttr.value
  if (!blockId) return

  const routeName = route.name
  if (routeName !== 'book-content' && routeName !== 'book-chapter') return

  const rawId = route.params.id
  const bookId = rawId != null ? Number(rawId) : NaN
  if (!bookId || Number.isNaN(bookId)) return

  ;(async () => {
    try {
      await upsertBookBookmark(bookId, blockId)
      // После сохранения сразу подтянем sectionId с бэка
      try {
        const loc = await getBookBookmarkLocation(bookId)
        if (loc) {
          bookmarkStore.setBookmark(bookId, loc.blockId, loc.sectionId)
        } else {
          bookmarkStore.setBookmark(bookId, blockId)
        }
      } catch (e) {
        // если запрос за location упал — всё равно оставим хотя бы blockId в сторе
        bookmarkStore.setBookmark(bookId, blockId)
      }
      ElMessage.success(t.value.bookContent.bookmarkSaved)
    } catch (err) {
      console.error('Failed to save book bookmark', err)
      ElMessage.error(t.value.bookContent.failedSaveBookmark)
    }
  })()
}
</script>

<style scoped>
.book-text--italic {
  font-style: italic;
}

.book-text--bold {
  font-weight: 600;
}

.episode-block--first-paragraph .episode-block__dialogue-text {
  margin-top: 8px;
}

.episode-block__toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
}

.episode-block__bookmark-btn {
  opacity: 0.6;
}

.episode-block__bookmark-btn--active {
  opacity: 1;
  color: #facc15;
}

.episode-block__bookmark-btn :deep(.el-icon) {
  vertical-align: middle;
}
</style>

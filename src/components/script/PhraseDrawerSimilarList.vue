<template>
  <div class="phrase-drawer-similar">
    <div class="phrase-drawer-similar__header">
      <h3 class="phrase-drawer-similar__title">{{ title }}</h3>
      <el-button type="primary" @click="$emit('createNew')">
        {{ createNewLabel }}
      </el-button>
    </div>
    <div v-if="loading" class="phrase-drawer-similar__loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>{{ searchingLabel }}</span>
    </div>
    <ul v-else class="phrase-drawer-similar__list">
      <li
        v-for="expanded in entries"
        :key="expanded.dictionary.id"
        class="phrase-drawer-similar__card"
      >
        <!-- Work title -->
        <div v-if="expanded.title" class="phrase-drawer-similar__work">
          <el-icon class="phrase-drawer-similar__work-icon"><VideoPlay /></el-icon>
          <span class="phrase-drawer-similar__work-title">{{ expanded.title }}</span>
        </div>

        <!-- Dictionary entry: phrase + translation + comment -->
        <div class="phrase-drawer-similar__entry">
          <div class="phrase-drawer-similar__value">{{ expanded.dictionary.value }}</div>
          <div v-if="expanded.dictionary.translation" class="phrase-drawer-similar__translation">
            {{ expanded.dictionary.translation }}
          </div>
          <div v-if="expanded.dictionary.comment" class="phrase-drawer-similar__comment">
            {{ expanded.dictionary.comment }}
          </div>
        </div>

        <!-- Context block: collapsed by default, expand on click -->
        <div v-if="hasBlockContent(expanded.block)" class="phrase-drawer-similar__block">
          <div
            class="phrase-drawer-similar__block-header"
            @click="toggleExpanded(expanded.dictionary.id)"
          >
            <el-button
              text
              size="small"
              :icon="isExpanded(expanded.dictionary.id) ? ArrowUp : ArrowDown"
            >
              {{ isExpanded(expanded.dictionary.id) ? hideContextLabel : showContextLabel }}
            </el-button>
          </div>
          <Transition name="phrase-drawer-similar-expand">
            <div
              v-show="isExpanded(expanded.dictionary.id)"
              class="phrase-drawer-similar__block-body-wrap"
            >
              <div
                class="phrase-drawer-similar__block-body"
                :class="blockBodyClass(expanded.block)"
              >
                <!-- Dialogue -->
                <template v-if="expanded.block?.type === 'dialogue'">
                  <div v-if="expanded.block.speaker" class="phrase-drawer-similar__block-speaker">
                    {{ expanded.block.speaker }}
                  </div>
                  <div v-if="expanded.block.parenthetical" class="phrase-drawer-similar__block-parenthetical">
                    ({{ expanded.block.parenthetical }})
                  </div>
                  <p v-if="expanded.block.text" class="phrase-drawer-similar__block-text">
                    <template v-for="(seg, i) in getHighlightSegments(expanded.block.text, expanded.dictionary.value)" :key="i">
                      <span v-if="seg.highlight" class="phrase-drawer-similar__word-highlight">{{ seg.text }}</span>
                      <template v-else>{{ seg.text }}</template>
                    </template>
                  </p>
                </template>
                <!-- Action -->
                <template v-else-if="expanded.block?.type === 'action'">
                  <p class="phrase-drawer-similar__block-text phrase-drawer-similar__block-text--action">
                    <template v-for="(seg, i) in getHighlightSegments(expanded.block.text, expanded.dictionary.value)" :key="i">
                      <span v-if="seg.highlight" class="phrase-drawer-similar__word-highlight">{{ seg.text }}</span>
                      <template v-else>{{ seg.text }}</template>
                    </template>
                  </p>
                </template>
                <!-- Scene -->
                <template v-else-if="expanded.block?.type === 'scene'">
                  <div v-if="expanded.block.title" class="phrase-drawer-similar__block-heading">
                    {{ expanded.block.title }}
                  </div>
                  <p v-if="expanded.block.description" class="phrase-drawer-similar__block-text">
                    <template v-for="(seg, i) in getHighlightSegments(expanded.block.description, expanded.dictionary.value)" :key="i">
                      <span v-if="seg.highlight" class="phrase-drawer-similar__word-highlight">{{ seg.text }}</span>
                      <template v-else>{{ seg.text }}</template>
                    </template>
                  </p>
                </template>
                <!-- Section -->
                <template v-else-if="expanded.block?.type === 'section'">
                  <div class="phrase-drawer-similar__block-heading">
                    {{ expanded.block.title || expanded.block.text }}
                  </div>
                </template>
                <!-- Transition or fallback -->
                <template v-else>
                  <p v-if="expanded.block?.text" class="phrase-drawer-similar__block-text">
                    <template v-for="(seg, i) in getHighlightSegments(expanded.block.text, expanded.dictionary.value)" :key="i">
                      <span v-if="seg.highlight" class="phrase-drawer-similar__word-highlight">{{ seg.text }}</span>
                      <template v-else>{{ seg.text }}</template>
                    </template>
                  </p>
                  <p v-else-if="expanded.block?.description" class="phrase-drawer-similar__block-text">
                    <template v-for="(seg, i) in getHighlightSegments(expanded.block.description, expanded.dictionary.value)" :key="i">
                      <span v-if="seg.highlight" class="phrase-drawer-similar__word-highlight">{{ seg.text }}</span>
                      <template v-else>{{ seg.text }}</template>
                    </template>
                  </p>
                </template>
              </div>
            </div>
          </Transition>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Loading, VideoPlay, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import type { ExpandedDictionaryDto } from "@/services/api";
import type { ContentBlockDto } from "@/services/api";
import { PHRASE_DRAWER_SIMILAR_ENTRIES } from "@/constants/phrase";

defineProps<{
  entries: ExpandedDictionaryDto[];
  loading: boolean;
  title: string;
  createNewLabel: string;
  searchingLabel: string;
}>();

const showContextLabel = PHRASE_DRAWER_SIMILAR_ENTRIES.showContext;
const hideContextLabel = PHRASE_DRAWER_SIMILAR_ENTRIES.hideContext;

defineEmits<{
  createNew: [];
}>();

const expandedIds = ref<Set<number>>(new Set());

function isExpanded(id: number): boolean {
  return expandedIds.value.has(id);
}

function toggleExpanded(id: number) {
  const next = new Set(expandedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expandedIds.value = next;
}

function hasBlockContent(block: ContentBlockDto | null | undefined): boolean {
  if (!block) return false;
  return !!(
    block.text?.trim() ||
    block.title?.trim() ||
    block.description?.trim() ||
    block.speaker?.trim() ||
    block.parenthetical?.trim()
  );
}

function blockBodyClass(block: ContentBlockDto | null | undefined): string {
  const type = block?.type ?? "action";
  return `phrase-drawer-similar__block-body--${type}`;
}

type HighlightSegment = { highlight: boolean; text: string };

function getHighlightSegments(fullText: string | null | undefined, highlightValue: string | null | undefined): HighlightSegment[] {
  const text = fullText ?? "";
  const value = highlightValue?.trim();
  if (!value) return [{ highlight: false, text }];
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(re);
  const segments: HighlightSegment[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === undefined) continue;
    segments.push({ highlight: i % 2 === 1, text: part });
  }
  return segments.length ? segments : [{ highlight: false, text }];
}
</script>

<style scoped>
.phrase-drawer-similar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.phrase-drawer-similar__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.phrase-drawer-similar__loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
}

.phrase-drawer-similar__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Card for each similar entry */
.phrase-drawer-similar__card {
  padding: 16px;
  border-radius: 12px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

/* Work (movie/series) title */
.phrase-drawer-similar__work {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  padding: 4px 10px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary-dark-2);
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

.phrase-drawer-similar__work-icon {
  font-size: 1rem;
}

.phrase-drawer-similar__work-title {
  font-weight: 600;
}

/* Dictionary entry (phrase, translation, comment) */
.phrase-drawer-similar__entry {
  margin-bottom: 10px;
}

.phrase-drawer-similar__value {
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--el-text-color-primary);
}

.phrase-drawer-similar__translation {
  margin-top: 4px;
  font-size: 0.95rem;
  color: var(--el-text-color-regular);
}

.phrase-drawer-similar__comment {
  margin-top: 6px;
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
  font-style: italic;
}

/* Context block: collapsible */
.phrase-drawer-similar__block {
  margin-top: 12px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color);
}

.phrase-drawer-similar__block-header {
  padding: 4px 8px;
  cursor: pointer;
  user-select: none;
}

.phrase-drawer-similar__block-header:hover {
  background: var(--el-fill-color-light);
}

.phrase-drawer-similar__block-body-wrap {
  border-top: 1px solid var(--el-border-color-lighter);
}

.phrase-drawer-similar__block-body {
  padding: 12px 14px;
  font-size: 0.9rem;
  line-height: 1.5;
}

.phrase-drawer-similar__block-body--dialogue .phrase-drawer-similar__block-speaker {
  font-weight: 600;
  color: var(--el-color-primary);
  margin-bottom: 4px;
}

.phrase-drawer-similar__block-parenthetical {
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
  font-style: italic;
  margin-bottom: 4px;
}

.phrase-drawer-similar__block-text {
  margin: 0;
  color: var(--el-text-color-regular);
}

.phrase-drawer-similar__word-highlight {
  color: var(--el-text-color-primary);
  background: linear-gradient(to bottom, transparent 60%, rgba(253, 186, 116, 0.45) 60%);
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 600;
}

.phrase-drawer-similar__block-text--action {
  font-style: italic;
  color: var(--el-text-color-secondary);
}

.phrase-drawer-similar__block-heading {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}
</style>

<style>
/* Expand/collapse transition (no scoped so transition name works) */
.phrase-drawer-similar-expand-enter-active,
.phrase-drawer-similar-expand-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.phrase-drawer-similar-expand-enter-from,
.phrase-drawer-similar-expand-leave-to {
  opacity: 0;
}
</style>

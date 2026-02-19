<template>
  <!-- Section -->
  <div
    v-if="block.type === 'section'"
    class="episode-block episode-block--section"
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
    :data-block-id="blockIdAttr"
  >
    <el-card shadow="never" class="episode-block__scene-card" body-style="padding: 10px 14px">
      <el-space :size="10" wrap>
        <el-text tag="span" class="episode-block__scene-label">Scene</el-text>
        <el-text tag="span" type="info" class="episode-block__scene-desc">{{ block.description }}</el-text>
      </el-space>
    </el-card>
  </div>

  <!-- Dialogue -->
  <div
    v-else-if="block.type === 'dialogue'"
    class="episode-block episode-block--dialogue"
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
          <el-text v-if="block.isUncut" size="small" class="episode-block__dialogue-uncut-flag"> (расширенная версия)</el-text>
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
    :data-block-id="blockIdAttr"
  >
    <el-text tag="p" type="info" class="episode-block__transition">{{ block.text }}</el-text>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TranscriptBlock } from '@/types/movie'

const props = defineProps<{
  block: TranscriptBlock
  index: number
}>()

const blockIdAttr = computed(() => {
  const b = props.block
  if ('id' in b && b.id != null && b.id !== '') return String(b.id)
  return undefined
})
</script>

<style scoped>
.episode-block {
  margin: 0;
  position: relative;
}

.episode-block--section :deep(.el-divider__text) {
  background: transparent;
  color: var(--fe-text-muted);
  font-size: 0.95rem;
}

.episode-block__scene-card {
  background: var(--fe-bg-elevated);
  border: 1px solid var(--fe-border);
  border-radius: 12px;
}

.episode-block__scene-label {
  display: inline-block;
  margin-right: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--fe-accent);
}

.episode-block__scene-desc {
  font-size: 1.05rem;
  color: var(--fe-text-secondary);
  font-style: italic;
}

.episode-block__dialogue {
  border-radius: 12px;
  background: var(--fe-bg-card);
  border-left: 3px solid var(--fe-border);
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.45);
}

.episode-block__dialogue:hover {
  background: var(--fe-bg-elevated);
  border-left-color: var(--fe-accent);
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
}

.episode-block__dialogue-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.episode-block__dialogue-speaker {
  color: var(--fe-accent) !important;
  border-color: var(--fe-accent-soft);
  font-weight: 600;
  font-size: 0.95rem !important;
}

.episode-block__dialogue-uncut-flag {
  margin-left: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--fe-text-secondary);
}

.episode-block__dialogue-parenthetical {
  font-size: 1rem;
  color: var(--fe-text-muted);
  font-style: italic;
}

.episode-block__dialogue-text {
  margin: 0;
  font-size: clamp(0.9375rem, 2.2vw + 0.85rem, 1.1rem);
  line-height: 1.65;
  color: var(--fe-text-primary);
  max-width: 65ch;
}

.episode-block__action {
  margin: 0;
  padding: clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px);
  font-size: clamp(0.9rem, 1.8vw + 0.8rem, 1.05rem);
  color: var(--fe-text-secondary);
  font-style: italic;
  line-height: 1.6;
  max-width: 65ch;
}

.episode-block__transition {
  margin: 0;
  padding: clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px);
  font-size: clamp(0.875rem, 1.5vw + 0.75rem, 1rem);
  color: var(--fe-text-muted);
  font-style: italic;
  line-height: 1.6;
}

/* Планшет / узкий экран */
@media (max-width: 600px) {
  .episode-block--section :deep(.el-divider__text) {
    font-size: 0.875rem;
  }

  .episode-block__scene-card :deep(.el-card__body) {
    padding: 8px 12px !important;
  }

  .episode-block__scene-label {
    font-size: 0.8rem;
  }

  .episode-block__scene-desc {
    font-size: 0.95rem;
  }

  .episode-block__dialogue {
    border-radius: 10px;
  }

  .episode-block__dialogue :deep(.el-card__body) {
    padding: 12px 14px !important;
  }

  .episode-block__dialogue-head {
    gap: 8px;
    margin-bottom: 6px;
  }

  .episode-block__dialogue-speaker {
    font-size: 0.875rem !important;
  }

  .episode-block__dialogue-uncut-flag {
    font-size: 0.75rem;
  }

  .episode-block__dialogue-parenthetical {
    font-size: 0.9rem;
  }

  .episode-block__dialogue-text {
    font-size: 1rem;
    line-height: 1.6;
  }

  .episode-block__action {
    font-size: 0.95rem;
    padding: 8px 12px;
  }

  .episode-block__transition {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
}

/* Телефон / Telegram — максимально компактно */
@media (max-width: 480px) {
  .episode-block--section :deep(.el-divider__text) {
    font-size: 0.8125rem;
  }

  .episode-block__scene-card {
    border-radius: 8px;
  }

  .episode-block__scene-card :deep(.el-card__body) {
    padding: 6px 10px !important;
  }

  .episode-block__scene-label {
    font-size: 0.75rem;
    margin-right: 6px;
  }

  .episode-block__scene-desc {
    font-size: 0.875rem;
  }

  .episode-block__dialogue {
    border-radius: 8px;
    border-left-width: 2px;
  }

  .episode-block__dialogue :deep(.el-card__body) {
    padding: 10px 12px !important;
  }

  .episode-block__dialogue:hover {
    transform: none;
  }

  .episode-block__dialogue-head {
    gap: 6px;
    margin-bottom: 4px;
  }

  .episode-block__dialogue-speaker {
    font-size: 0.8125rem !important;
  }

  .episode-block__dialogue-uncut-flag {
    font-size: 0.7rem;
  }

  .episode-block__dialogue-parenthetical {
    font-size: 0.8125rem;
  }

  .episode-block__dialogue-text {
    font-size: 0.9375rem;
    line-height: 1.55;
  }

  .episode-block__action {
    font-size: 0.875rem;
    padding: 6px 10px;
  }

  .episode-block__transition {
    font-size: 0.8125rem;
    padding: 6px 10px;
  }
}
</style>

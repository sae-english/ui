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
        <el-text tag="span" class="episode-block__scene-label">{{ t.common.scene }}</el-text>
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
import { useI18n } from '@/i18n'

const { t } = useI18n()
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

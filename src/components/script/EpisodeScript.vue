<template>
  <div class="episode-script">
    <el-space class="episode-script__blocks" direction="vertical" :size="10" fill>
      <EpisodeBlock
        v-for="(block, index) in blocks"
        :key="index"
        :block="block"
        :index="index"
        :highlight-quotes="highlightQuotes"
      />
    </el-space>
  </div>
</template>

<script setup lang="ts">
import type { TranscriptBlock } from '@/types/movie'
import EpisodeBlock from '@/components/script/EpisodeBlock.vue'

withDefaults(
  defineProps<{
    blocks: TranscriptBlock[]
    highlightQuotes?: boolean
  }>(),
  { highlightQuotes: false }
)
</script>

<template>
  <div ref="scriptRootRef" class="episode-script">
    <el-space class="episode-script__blocks" direction="vertical" :size="10" fill>
      <EpisodeBlock
        v-for="(block, index) in blocks"
        :key="index"
        :block="block"
        :index="index"
      />
    </el-space>
    <Transition name="script-add-fab">
      <el-button
        v-show="showAddButton"
        circle
        type="primary"
        size="large"
        class="episode-script__add-fab"
        :title="'Добавить в словарь'"
        @click="onAddClick"
      >
        <el-icon :size="24"><DocumentAdd /></el-icon>
      </el-button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTextSelection } from '@vueuse/core'
import { DocumentAdd } from '@element-plus/icons-vue'
import type { TranscriptBlock } from '@/types/movie'
import EpisodeBlock from '@/components/script/EpisodeBlock.vue'

defineProps<{
  blocks: TranscriptBlock[]
}>()

const emit = defineEmits<{
  addSelection: [payload: { text: string; blockId?: string }]
}>()

const scriptRootRef = ref<HTMLElement | null>(null)
const { text: selectedText, ranges: selectedRanges } = useTextSelection()

function getBlockIdFromNode(node: Node | null): string | undefined {
  let el: Element | null = node instanceof Element ? node : node?.parentElement ?? null
  while (el) {
    const id = el.getAttribute?.('data-block-id')
    if (id != null) return id
    el = el.parentElement
  }
  return undefined
}

const selectionInScope = computed(() => {
  const root = scriptRootRef.value
  const text = selectedText.value.trim()
  if (!root || !text) return { show: false, text: '', blockId: undefined as string | undefined }
  const rangeList = selectedRanges.value
  const range = rangeList.length ? rangeList[0] : null
  if (!range) return { show: false, text: '', blockId: undefined }
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) {
    return { show: false, text: '', blockId: undefined }
  }
  const blockId = getBlockIdFromNode(range.commonAncestorContainer)
  return { show: true, text, blockId }
})

const showAddButton = computed(() => selectionInScope.value.show)

function onAddClick() {
  const { text, blockId } = selectionInScope.value
  if (!text) return
  emit('addSelection', { text, blockId })
  window.getSelection()?.removeAllRanges()
}
</script>

<style scoped>
.episode-script {
  position: relative;
  width: 100%;
}

.episode-script__blocks {
  width: 100%;
}

.episode-script__add-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  z-index: 100;
}

.episode-script__add-fab :deep(.el-icon) {
  font-size: 24px;
}

.script-add-fab-enter-active,
.script-add-fab-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.script-add-fab-enter-from,
.script-add-fab-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>

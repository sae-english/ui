<template>
  <div ref="scriptRootRef" class="phrase-add-button">
    <slot />
    <Transition name="script-add-fab">
      <el-button
        v-show="showAddButton"
        circle
        type="primary"
        size="large"
        class="episode-script__add-fab"
        :title="'Add to dictionary'"
        @click="onAddClick"
      >
        <el-icon :size="24"><DocumentAdd /></el-icon>
      </el-button>
    </Transition>
    <PhraseDrawer
      v-model:visible="drawerVisible"
      :initial-phrase="drawerInitialPhrase"
      :content-key="props.contentKey"
      :content-type="props.contentType"
      :block-id="drawerBlockId"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useTextSelection } from "@vueuse/core";
import { DocumentAdd } from "@element-plus/icons-vue";
import type { DictionaryContentType } from "@/services/api";
import PhraseDrawer from "@/components/script/PhraseDrawer.vue";

const props = defineProps<{
  /** Content key (movie/episode) for linking dictionary entry. */
  contentKey?: string | null;
  /** Content type. */
  contentType: DictionaryContentType;
}>();

const scriptRootRef = ref<HTMLElement | null>(null);
const { text: selectedText, ranges: selectedRanges } = useTextSelection();

const drawerVisible = ref(false);
const drawerInitialPhrase = ref("");
const drawerBlockId = ref<string | undefined>(undefined);

function getBlockIdFromNode(node: Node | null): string | undefined {
  let el: Element | null =
    node instanceof Element ? node : (node?.parentElement ?? null);
  while (el) {
    const id = el.getAttribute?.("data-block-id");
    if (id != null) return id;
    el = el.parentElement;
  }
  return undefined;
}

const selectionInScope = computed(() => {
  const root = scriptRootRef.value;
  const text = selectedText.value.trim();
  if (!root || !text)
    return { show: false, text: "", blockId: undefined as string | undefined };
  const rangeList = selectedRanges.value;
  const range = rangeList.length ? rangeList[0] : null;
  if (!range) return { show: false, text: "", blockId: undefined };
  if (
    !root.contains(range.startContainer) ||
    !root.contains(range.endContainer)
  ) {
    return { show: false, text: "", blockId: undefined };
  }
  const blockId = getBlockIdFromNode(range.commonAncestorContainer);
  return { show: true, text, blockId };
});

const showAddButton = computed(() => selectionInScope.value.show);

function onAddClick() {
  const { text, blockId } = selectionInScope.value;
  if (!text) return;
  drawerInitialPhrase.value = text;
  drawerBlockId.value = blockId;
  drawerVisible.value = true;
  window.getSelection()?.removeAllRanges();
}
</script>

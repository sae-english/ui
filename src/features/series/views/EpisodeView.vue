<template>
  <el-container class="episode" direction="vertical">
    <el-header class="episode__header" height="auto">
      <BackButton label="Назад" @click="goBack" />
    </el-header>

    <el-main class="episode__main">
      <div v-if="loading" class="content-loader-wrap">
        <ContentLoader message="Загрузка эпизода..." />
      </div>

      <el-empty v-else-if="error" description="Эпизод не найден">
        <el-button type="primary" @click="goBack">На главную</el-button>
      </el-empty>

      <template v-else-if="transcript">
        <el-main class="episode__content">
          <EpisodeHero
            :episode-id="transcript.episodeId"
            :title="transcript.title"
          />
          <EpisodeScript
            :blocks="transcript.blocks"
            @add-selection="handleBlockAddSelection"
          />
        </el-main>

        <PhraseDrawer
          v-model:visible="drawerVisible"
          :form="phraseForm"
          :loading="drawerSubmitting"
          :dictionary-context="drawerContext"
          @update:form="updatePhraseForm"
          @submit="handleDrawerSubmit"
        />
      </template>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BackButton from '@/components/ui/BackButton.vue'
import {
  getEpisodeById,
  toEpisodeTranscript,
  saveDictionaryEntry,
  type EpisodeTranscript,
} from '@/services/api'
import type { PhraseFormModel } from '@/types/phrase'
import ContentLoader from '@/components/ui/ContentLoader.vue'
import EpisodeHero from '@/components/script/EpisodeHero.vue'
import EpisodeScript from '@/components/script/EpisodeScript.vue'
import PhraseDrawer, { type DictionaryContext } from '@/components/script/PhraseDrawer.vue'

const route = useRoute()
const router = useRouter()

const episodeId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id, 10) : Number(id)
})

const transcript = ref<EpisodeTranscript | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const drawerVisible = ref(false)
const episodeContentKey = ref<string | null>(null)
const drawerPendingBlockId = ref<string | undefined>(undefined)
const drawerContext = computed(() => ({
  contentKey: episodeContentKey.value ?? undefined,
  contentType: 'EPISODE' as const,
  blockId: drawerPendingBlockId.value ?? undefined,
}))
const phraseForm = ref<PhraseFormModel>({
  phrase: '',
  translation: '',
  comment: '',
})

async function loadEpisode() {
  const id = episodeId.value
  if (!id || isNaN(id)) return
  loading.value = true
  error.value = null
  try {
    const dto = await getEpisodeById(id)
    episodeContentKey.value = dto.contentKey ?? null
    transcript.value = toEpisodeTranscript(dto)
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось загрузить эпизод'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

function handleBlockAddSelection(payload: { text: string; blockId?: string }) {
  phraseForm.value = { phrase: payload.text, translation: '', comment: '' }
  drawerPendingBlockId.value = payload.blockId
  drawerVisible.value = true
}

function goBack() {
  router.back()
}

function updatePhraseForm(payload: PhraseFormModel) {
  phraseForm.value = payload
}

const drawerSubmitting = ref(false)

async function handleDrawerSubmit(payload: {
  form: PhraseFormModel
  context?: DictionaryContext | null
}) {
  const { form, context } = payload
  if (!form.phrase?.trim() || !form.translation?.trim()) {
    ElMessage.warning('Заполни фразу и перевод')
    return
  }

  drawerSubmitting.value = true
  try {
    await saveDictionaryEntry({
      value: form.phrase,
      translation: form.translation,
      comment: form.comment || undefined,
      contentKey: context?.contentKey,
      contentType: context?.contentType as 'EPISODE' | undefined,
      blockId: context?.blockId,
    })
    ElMessage.success('Сохранено в словарь')
    drawerVisible.value = false
    phraseForm.value = { phrase: '', translation: '', comment: '' }
  } catch (e) {
    console.error(e)
    ElMessage.error('Не удалось сохранить. Проверь сервер.')
  } finally {
    drawerSubmitting.value = false
  }
}

onMounted(loadEpisode)
watch(episodeId, loadEpisode)
</script>

<template>
  <div class="catalog">
    <PageSectionHeader
      :title="t.comedyCatalog.title"
      :subtitle="t.comedyCatalog.subtitle"
    />

    <el-main class="catalog__content">
      <div v-if="loading" class="catalog__loading content-loader-wrap">
        <ContentLoader :message="t.comedyCatalog.loading" :icon="Loading" :icon-size="32" />
      </div>

      <el-empty v-else-if="error" :description="error">
        <el-button type="primary" @click="loadSpecials">{{ t.comedyCatalog.retry }}</el-button>
      </el-empty>

      <template v-else>
        <section v-if="specials.length" class="catalog__section">
          <h2 class="catalog__section-title">{{ t.comedyCatalog.sectionSpecials }}</h2>
          <el-row :gutter="24" class="catalog__poster-list">
            <el-col
              v-for="special in specials"
              :key="special.id"
              :xs="12"
              :sm="8"
              :md="6"
              :lg="4"
              class="catalog__poster-item"
            >
              <ComedySpecialCard :special="special" @click="openSpecial(special)" />
            </el-col>
          </el-row>
        </section>

        <el-empty v-else :description="t.comedyCatalog.noSpecials" />
      </template>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import ContentLoader from '@/components/ui/ContentLoader.vue'
import PageSectionHeader from '@/components/layout/PageSectionHeader.vue'
import { getComedySpecials } from '@/features/comedy/api'
import type { ComedySpecialDto } from '@/features/comedy/types'
import { CATALOG_COMEDY_LIMIT } from '@/constants/defaults'
import ComedySpecialCard from '@/features/comedy/components/ComedySpecialCard.vue'

const router = useRouter()
const { navQuery } = useLanguage()
const { t } = useI18n()
const specials = ref<ComedySpecialDto[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function loadSpecials() {
  loading.value = true
  error.value = null
  try {
    specials.value = await getComedySpecials(CATALOG_COMEDY_LIMIT)
  } catch (e) {
    console.error(e)
    error.value = t.value.comedyCatalog.errorLoadSpecials
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

function openSpecial(special: ComedySpecialDto) {
  router.push({
    name: 'comedy-content',
    params: { id: String(special.id) },
    query: navQuery(),
    state: { special: JSON.parse(JSON.stringify(special)) },
  })
}

onMounted(loadSpecials)
</script>

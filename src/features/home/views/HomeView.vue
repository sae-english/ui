<template>
  <div class="home">
    <HomeHero
      :title="t.home.heroTitle"
      :tagline="t.home.heroTagline"
    />

    <section class="home__sections">
      <HomeCard
        :title="t.home.cardMovies"
        :description="t.home.cardMoviesDesc"
        :icon="VideoCameraFilled"
        :to="to('/movies')"
      />
      <HomeCard
        :title="t.home.cardSeries"
        :description="t.home.cardSeriesDesc"
        :icon="Film"
        :to="to('/series')"
      />
      <HomeCard
        :title="t.home.cardBooks"
        :description="t.home.cardBooksDesc"
        :icon="Reading"
      />
      <HomeCard
        :title="t.home.cardSongs"
        :description="t.home.cardSongsDesc"
        :icon="Headset"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { VideoCameraFilled, Film, Reading, Headset } from '@element-plus/icons-vue'
import { useLanguage } from '@/composables/useLanguage'
import { useI18n } from '@/i18n'
import HomeHero from '@/features/home/components/HomeHero.vue'
import HomeCard from '@/features/home/components/HomeCard.vue'

const { to } = useLanguage()
const { t } = useI18n()
</script>

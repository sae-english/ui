<template>
  <div class="home">
    <HomeHero
      title="English Movies"
      tagline="Учи английский через то, что любишь"
    />

    <section class="home__sections">
      <HomeCard
        title="Movies"
        description="Скрипты, диалоги, переводы. Выбери фильм и начни практику."
        :icon="VideoCameraFilled"
        :to="to('/movies')"
      />
      <HomeCard
        title="Series"
        description="Скоро"
        :icon="Film"
      />
      <HomeCard
        title="Books"
        description="Скоро"
        :icon="Reading"
      />
      <HomeCard
        title="Songs"
        description="Скоро"
        :icon="Headset"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { VideoCameraFilled, Film, Reading, Headset } from '@element-plus/icons-vue'
import { useLanguage } from '@/composables/useLanguage'
import HomeHero from '@/features/home/components/HomeHero.vue'
import HomeCard from '@/features/home/components/HomeCard.vue'

const { to } = useLanguage()
</script>

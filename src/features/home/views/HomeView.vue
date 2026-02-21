<template>
  <div class="home">
    <HomeHero
      title="English Movies"
      tagline="Learn English through what you love"
    />

    <section class="home__sections">
      <HomeCard
        title="Movies"
        description="Scripts, dialogues, translations. Pick a movie and start practicing."
        :icon="VideoCameraFilled"
        :to="to('/movies')"
      />
      <HomeCard
        title="Series"
        description="Coming soon"
        :icon="Film"
      />
      <HomeCard
        title="Books"
        description="Coming soon"
        :icon="Reading"
      />
      <HomeCard
        title="Songs"
        description="Coming soon"
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

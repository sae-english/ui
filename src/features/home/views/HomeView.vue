<template>
  <div class="home">
    <section class="home__hero">
      <h1 class="home__title">English Movies</h1>
      <p class="home__tagline">Учи английский через то, что любишь</p>
    </section>

    <section class="home__sections">
      <RouterLink :to="to('/movies')" class="home__card home__card--clickable">
        <el-icon class="home__card-icon"><VideoCameraFilled /></el-icon>
        <h2 class="home__card-title">Movies</h2>
        <p class="home__card-desc">
          Скрипты, диалоги, переводы. Выбери фильм и начни практику.
        </p>
        <el-icon class="home__card-arrow"><ArrowRight /></el-icon>
      </RouterLink>

      <div class="home__card home__card--disabled">
        <el-icon class="home__card-icon"><Film /></el-icon>
        <h2 class="home__card-title">Series</h2>
        <p class="home__card-desc">Скоро</p>
      </div>

      <div class="home__card home__card--disabled">
        <el-icon class="home__card-icon"><Reading /></el-icon>
        <h2 class="home__card-title">Books</h2>
        <p class="home__card-desc">Скоро</p>
      </div>

      <div class="home__card home__card--disabled">
        <el-icon class="home__card-icon"><Headset /></el-icon>
        <h2 class="home__card-title">Songs</h2>
        <p class="home__card-desc">Скоро</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { VideoCameraFilled, ArrowRight, Film, Reading, Headset } from '@element-plus/icons-vue'
import { useLanguage } from '@/composables/useLanguage'

const { to } = useLanguage()
</script>

<style scoped>
.home {
  min-height: calc(100vh - 60px);
  padding: 48px 24px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background:
    radial-gradient(ellipse 100% 60% at 50% 0%, rgba(31, 41, 55, 0.5) 0, transparent 50%),
    var(--fe-bg-base);
  font-family: var(--fe-font-body);
}

.home__hero {
  text-align: center;
  margin-bottom: 56px;
}

.home__title {
  font-family: var(--fe-font-heading);
  font-size: 2.75rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--fe-text-primary);
  margin: 0 0 12px;
}

.home__tagline {
  font-size: 1.25rem;
  color: var(--fe-text-secondary);
  margin: 0;
  font-weight: 400;
}

.home__sections {
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 320px));
  gap: 24px;
  width: 100%;
  max-width: 700px;
  justify-content: center;
}

.home__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid var(--fe-border);
  background: var(--fe-bg-card);
  text-decoration: none;
  color: inherit;
  transition:
    border-color var(--fe-transition-fast),
    background var(--fe-transition-fast),
    transform var(--fe-transition-fast),
    box-shadow var(--fe-transition-normal);
}

.home__card--clickable {
  cursor: pointer;
}

.home__card--clickable:hover {
  border-color: var(--fe-accent);
  background: var(--fe-bg-elevated);
  transform: translateY(-4px);
  box-shadow: var(--fe-shadow-lg);
}

.home__card--clickable:hover .home__card-title {
  color: var(--fe-accent);
}

.home__card--clickable:hover .home__card-arrow {
  transform: translateX(4px);
}

.home__card--disabled {
  opacity: 0.7;
  cursor: default;
}

.home__card-icon {
  font-size: 2rem;
  color: var(--fe-accent);
  margin-bottom: 16px;
}

.home__card-title {
  font-family: var(--fe-font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--fe-text-primary);
  margin: 0 0 8px;
  transition: color var(--fe-transition-fast);
}

.home__card-desc {
  font-size: 1rem;
  color: var(--fe-text-secondary);
  line-height: 1.5;
  margin: 0 0 20px;
  flex: 1;
}

.home__card-arrow {
  font-size: 1.25rem;
  color: var(--fe-accent);
  margin-top: auto;
  transition: transform var(--fe-transition-fast);
}

@media (max-width: 600px) {
  .home {
    padding: 32px 20px 48px;
  }

  .home__hero {
    margin-bottom: 40px;
  }

  .home__title {
    font-size: 2rem;
  }

  .home__tagline {
    font-size: 1.1rem;
  }

  .home__sections {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  .home__card {
    padding: 24px;
  }
}
</style>

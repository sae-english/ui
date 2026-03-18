<template>
  <RouterLink
    :to="to"
    :class="[
      baseClass,
      isActive ? activeClass : '',
    ]"
    @click.prevent="navigate"
  >
    <slot />
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    to: RouteLocationRaw
    /** Base path used for determining active state (e.g. "/movies") */
    pathForActive: string
    baseClass?: string
    activeClass?: string
  }>(),
  {
    baseClass: '',
    activeClass: '',
  },
)

const route = useRoute()
const router = useRouter()

const isActive = computed(() => {
  const p = props.pathForActive
  if (p === '/') return route.path === '/'
  return route.path.startsWith(p)
})

function navigate() {
  router.push(props.to)
}
</script>


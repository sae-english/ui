import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { VueQueryPlugin } from '@tanstack/vue-query'

import '@/style.css'
import App from '@/App.vue'
import { router } from '@/router'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.use(VueQueryPlugin)

app.mount('#app')

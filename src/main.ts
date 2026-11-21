import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { finishBoot } from './boot'
import './styles/tokens.css'
import './styles/main.css'
import './styles/pages.css'
import './styles/inner.css'
import './styles/dark.css'

const app = createApp(App).use(router)
router.isReady().then(() => {
  app.mount('#app')
  finishBoot()
})

import { createApp } from 'vue'
import pinia from '@/stores/index'
import App from './App.vue'
import router from './router'
import 'normalize.css'
import '@/style/reset.scss'
import 'nprogress/nprogress.css'
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

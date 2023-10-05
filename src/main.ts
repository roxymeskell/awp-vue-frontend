import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

//Import Pinia into your config file
import { createPinia } from 'pinia'

createApp(App).use(createPinia()).mount('#app')

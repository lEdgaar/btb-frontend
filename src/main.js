import './assets/main.css'
import RouterViews from "./router/Router.js"
import BootstrapVueNext from 'bootstrap-vue-next'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'


createApp(App)
    .use(RouterViews)
    .use(BootstrapVueNext)
    .use(createPinia())
    .mount('#app')

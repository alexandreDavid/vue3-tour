import { createApp } from 'vue'
import App from './App.vue'
import Lib from './lib.js'

const app = createApp(App)

console.log('uselib')
app.use(Lib)

app.mount('#app')

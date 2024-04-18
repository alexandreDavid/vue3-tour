import VTour from  './components/v-tour/VTour.vue'
import VStep from './components/v-step/VStep.vue'

import type { App } from 'vue'

const install = (app: App) => {
  app.config.globalProperties.$tours = {}

  app.component('v-tour', VTour)
  app.component('v-step', VStep)
}

export default install

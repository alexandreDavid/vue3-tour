import type { App } from 'vue'

import VTour from './components/VTour.vue'
import VStep from './components/VStep.vue'


const install = (app: App) => {
  app.config.globalProperties.$tours = {}

  app.component(VTour.name, VTour)
  app.component(VStep.name, VStep)
}

export default install

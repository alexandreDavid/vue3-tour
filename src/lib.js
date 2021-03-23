import VTour from './components/Vtour.vue'
import VStep from './components/VStep.vue'

const install = (app) => {
  app.config.globalProperties.$tours = {}

  app.component(VTour.name, VTour)
  app.component(VStep.name, VStep)
}

export default install

<template>
  <div>
    <div id="v-step-0">
      A DOM element on your page. The first step will pop on this element because its ID is 'v-step-0'.
    </div>
    <div class="v-step-1">
      A DOM element on your page. The second step will pop on this element because its ID is 'v-step-1'.
    </div>
    <div data-v-step="2">
      A DOM element on your page. The third and final step will pop on this element because its ID is 'v-step-2'.
    </div>

    <v-tour name="myTour" :steps="steps" :options="options"></v-tour>
  </div>
</template>

<script setup lang="ts">
import { onMounted, getCurrentInstance } from 'vue';

import type { Step, VTourOptions } from '../../types/vue3-tour'

const steps: Step[] = [
  {
    target: '#v-step-0',  // We're using document.querySelector() under the hood
    header: {
      title: 'Get Started',
    },
    content: `Discover <strong>Vue Tour</strong>!`,
  },
  {
    target: '.v-step-1',
    content: 'An awesome plugin made with Vue.js!'
  },
  {
    target: '[data-v-step="2"]',
    content: 'Try it, you\'ll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.',
    params: {
      placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
    }
  }
]
const options: VTourOptions = {
  highlight: true
}

onMounted(() => {
  getCurrentInstance()?.appContext.config.globalProperties.$tours['myTour'].start()
})
</script>

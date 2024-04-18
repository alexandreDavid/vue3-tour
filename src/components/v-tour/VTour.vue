<template>
  <div class="v-tour">
    <slot :current-step="currentStep" :steps="steps" :previous-step="previousStep" :next-step="nextStep" :stop="stop"
      :skip="skip" :finish="finish" :is-first="isFirst" :is-last="isLast" :labels="customOptions.labels"
      :enabled-buttons="customOptions.enabledButtons" :highlight="customOptions.highlight" :debug="customOptions.debug">
      <!--Default slot {{ currentStep }}-->
      <v-step v-if="steps[currentStep]" :step="steps[currentStep]" :key="currentStep" :previous-step="previousStep"
        :next-step="nextStep" :stop="stop" :skip="skip" :finish="finish" :is-first="isFirst" :is-last="isLast"
        :labels="customOptions.labels" :enabled-buttons="customOptions.enabledButtons"
        :highlight="customOptions.highlight" :stop-on-fail="customOptions.stopOnTargetNotFound"
        :debug="customOptions.debug" @targetNotFound="$emit('targetNotFound', $event)">
        <!--<div v-if="index === 2" slot="actions">
          <a @click="nextStep">Next step</a>
        </div>-->
      </v-step>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { DEFAULT_CALLBACKS, DEFAULT_OPTIONS, KEYS } from '../../shared/constants'

import type { VTourProps, EnabledNavigationKeys } from '../../../types/vue3-tour'

const props = withDefaults(defineProps<VTourProps>(), {
  steps: () => [],
  options: () => DEFAULT_OPTIONS,
  callbacks: () => DEFAULT_CALLBACKS,
})

const currentStep = ref(-1)

const customOptions = computed(() => {
  return {
    ...DEFAULT_OPTIONS,
    ...props.options
  }
})

const customCallbacks = computed(() => {
  return {
    ...DEFAULT_CALLBACKS,
    ...props.callbacks
  }
})

const isRunning = computed(() => currentStep.value > -1 && currentStep.value < numberOfSteps.value)

const isFirst = computed(() => currentStep.value === 0)

const isLast = computed(() => currentStep.value === props.steps.length - 1)

const numberOfSteps = computed(() => props.steps.length)

const step = computed(() => props.steps[currentStep.value])

const start = async (startStep: number | string) => {
  // Wait for the DOM to be loaded, then start the tour
  startStep = typeof startStep !== 'undefined' ? parseInt(String(startStep), 10) : 0
  let step = props.steps[startStep]
  let process = () => new Promise<void>((resolve) => {
    setTimeout(() => {
      customCallbacks.value.onStart()
      currentStep.value = startStep
      resolve()
    }, customOptions.value.startTimeout)
  })
  if (typeof step.before !== 'undefined') {
    try {
      await step.before('start')
    } catch (e) {
      return Promise.reject(e)
    }
  }
  await process()
  customCallbacks.value.onStart()
  currentStep.value = startStep

  return Promise.resolve()
}

const previousStep = async () => {
  let futureStep = currentStep.value - 1
  let process = () => new Promise<void>((resolve) => {
    customCallbacks.value.onPreviousStep(currentStep.value)
    currentStep.value = futureStep
    resolve()
  })
  if (futureStep > -1) {
    let step = props.steps[futureStep]
    if (typeof step.before !== 'undefined') {
      try {
        await step.before('previous')
      } catch (e) {
        return Promise.reject(e)
      }
    }
    await process()
  }
  return Promise.resolve()
}

const nextStep = async () => {
  let futureStep = currentStep.value + 1
  let process = () => new Promise<void>((resolve) => {
    customCallbacks.value.onNextStep(currentStep.value)
    currentStep.value = futureStep
    resolve()
  })
  if (futureStep < numberOfSteps.value && currentStep.value !== -1) {
    let step = props.steps[futureStep]
    if (typeof step.before !== 'undefined') {
      try {
        await step.before('next')
      } catch (e) {
        return Promise.reject(e)
      }
    }
    await process()
  }
  return Promise.resolve()
}

const stop = () => {
  customCallbacks.value.onStop()
  document.body.classList.remove('v-tour--active')
  currentStep.value = -1
}

const skip = () => {
  customCallbacks.value.onSkip()
  stop()
}

const finish = () => {
  customCallbacks.value.onFinish()
  stop()
}

const handleKeyup = (e: KeyboardEvent) => {
  if (customOptions.value.debug) {
    console.log('[Vue Tour] A keyup event occured:', e)
  }
  switch (e.keyCode) {
    case KEYS.ARROW_RIGHT:
      isKeyEnabled('ARROW_RIGHT') && nextStep()
      break
    case KEYS.ARROW_LEFT:
      isKeyEnabled('ARROW_LEFT') && previousStep()
      break
    case KEYS.ESCAPE:
      isKeyEnabled('ESCAPE') && stop()
      break
  }
}

const isKeyEnabled = (key: keyof EnabledNavigationKeys) => {
  const { enabledNavigationKeys } = customOptions.value
  return enabledNavigationKeys.hasOwnProperty(key) ? enabledNavigationKeys[key] : true
}

onMounted(() => {
  const app = getCurrentInstance()
  if (app) {
    app.appContext.config.globalProperties.$tours[props.name] = {
      step, start,
      isRunning,
      customOptions,
      currentStep,
      isFirst,
      isLast,
      previousStep,
      nextStep,
      stop,
      skip,
      finish,
      numberOfSteps,
    }
  }
  if (customOptions.value.useKeyboardNavigation) {
    window.addEventListener('keyup', handleKeyup)
  }
})

onBeforeUnmount(() => {
  if (customOptions.value.useKeyboardNavigation) {
    window.removeEventListener('keyup', handleKeyup)
  }
})

</script>

<style lang="scss">
@import 'v-tour';
</style>

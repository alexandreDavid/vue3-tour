<template>
  <!-- <teleport to="body"> -->
  <!-- <div class="tour-mask" v-show="displayMask">
      <div class="tour-focus-container" v-bind:style="styleFocusContainer"></div>
    </div> -->
  <div :class="{ 'v-step--sticky': isSticky }" class="v-step" :id="'v-step-' + hash" ref="VStep">
    <slot name="header">
      <div v-if="step.header" class="v-step__header">
        <div v-if="step.header.title" v-html="step.header.title"></div>
      </div>
    </slot>

    <slot name="content">
      <div class="v-step__content">
        <div v-if="step.content" v-html="step.content"></div>
        <div v-else>props is a demo step! The id of props step is {{ hash }} and it targets {{ step.target }}.</div>
      </div>
    </slot>

    <slot name="actions">
      <div class="v-step__buttons">
        <button @click.prevent="onSkip" v-if="!isLast && isButtonEnabled('buttonSkip')"
          class="v-step__button v-step__button-skip">{{ labels?.buttonSkip }}</button>
        <button @click.prevent="previousStep" v-if="!isFirst && isButtonEnabled('buttonPrevious')"
          class="v-step__button v-step__button-previous">{{ labels?.buttonPrevious }}</button>
        <button @click.prevent="nextStep" v-if="!isLast && isButtonEnabled('buttonNext')"
          class="v-step__button v-step__button-next">{{ labels?.buttonNext }}</button>
        <button @click.prevent="onFinish" v-if="isLast && isButtonEnabled('buttonStop')"
          class="v-step__button v-step__button-stop">{{ labels?.buttonStop }}</button>
      </div>
    </slot>

    <div class="v-step__arrow" :class="{ 'v-step__arrow--dark': step.header && step.header.title }" data-popper-arrow>
    </div>
  </div>
  <!-- </teleport> -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { createPopper } from '@popperjs/core'
import jump from 'jump.js'
import { DEFAULT_STEP_OPTIONS, HIGHLIGHT } from '../../shared/constants'

import type { VStepProps, EnabledButtons } from '../../../types/vue3-tour'

const props = defineProps<VStepProps>()

const emit = defineEmits(['targetNotFound'])

const onSkip = () => (props.skip || props.stop)()
const onFinish = () => (props.finish || props.stop)()

const hashCode = (str: string): number => {
  var h: number = 0;
  for (var i = 0; i < str.length; i++) {
    h = 31 * h + str.charCodeAt(i);
  }
  return h & 0xFFFFFFFF
}

const hash = hashCode(props.step.target)
const targetElement: HTMLElement | null = document.querySelector(props.step.target)

const params = computed(() => {
  return {
    ...DEFAULT_STEP_OPTIONS,
    ...{ highlight: props.highlight }, // Use global tour highlight setting first
    ...{ enabledButtons: Object.assign({}, props.enabledButtons) },
    ...props.step.params // Then use local step parameters if defined
  }
})

const isSticky = computed(() => {
  return !props.step.target
})

const VStep = ref(null)

const createStep = () => {
  if (props.debug) {
    console.log('[Vue Tour] The target element ' + props.step.target + ' of .v-step[id="' + hash + '"] is:', targetElement)
  }

  if (!VStep.value) {
    if (props.debug) {
      console.error('[Vue Tour] The target element ' + props.step.target + ' of .v-step[id="' + hash + '"] does not exist!')
    }

    return
  }

  if (isSticky.value) {
    document.body.appendChild(VStep.value)
  } else {
    if (targetElement) {
      enableScrolling()
      createHighlight()

      createPopper(
        targetElement,
        VStep.value,
        params.value
      )
    } else {
      if (props.debug) {
        console.error('[Vue Tour] The target element ' + props.step.target + ' of .v-step[id="' + hash + '"] does not exist!')
      }
      emit('targetNotFound', props.step)
      if (props.stopOnFail) {
        props.stop()
      }
    }
  }
}

const enableScrolling = () => {
  if (targetElement && params.value.enableScrolling) {
    if (props.step.duration || props.step.offset) {
      let jumpOptions = {
        duration: props.step.duration || 1000,
        offset: props.step.offset || 0,
        callback: undefined,
        a11y: false
      }

      jump(targetElement, jumpOptions)
    } else {
      // Use the native scroll by default if no scroll options has been defined
      targetElement.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

const isHighlightEnabled = () => {
  if (props.debug) {
    console.log(`[Vue Tour] Highlight is ${params.value.highlight ? 'enabled' : 'disabled'} for .v-step[id="${hash}"]`)
  }
  return params.value.highlight
}

const createHighlight = () => {
  if (targetElement && isHighlightEnabled()) {
    document.body.classList.add(HIGHLIGHT.CLASSES.ACTIVE)
    const transitionValue = window.getComputedStyle(targetElement).getPropertyValue('transition')

    // Make sure our background doesn't flick on transitions
    if (transitionValue !== 'all 0s ease 0s') {
      targetElement.style.transition = `${transitionValue}, ${HIGHLIGHT.TRANSITION}`
    }

    targetElement.classList.add(HIGHLIGHT.CLASSES.TARGET_HIGHLIGHTED)

    // The element must have a position, if it doesn't have one, add a relative position class
    if (!targetElement.style.position) {
      targetElement.classList.add(HIGHLIGHT.CLASSES.TARGET_RELATIVE)
    }
  } else {
    document.body.classList.remove(HIGHLIGHT.CLASSES.ACTIVE)
  }
}

const removeHighlight = () => {
  if (targetElement && isHighlightEnabled()) {
    const currentTransition = targetElement.style.transition
    targetElement.classList.remove(HIGHLIGHT.CLASSES.TARGET_HIGHLIGHTED)
    targetElement.classList.remove(HIGHLIGHT.CLASSES.TARGET_RELATIVE)
    // Remove our transition when step is finished.
    if (currentTransition.includes(HIGHLIGHT.TRANSITION)) {
      setTimeout(() => {
        targetElement.style.transition = currentTransition.replace(`, ${HIGHLIGHT.TRANSITION}`, '')
      }, 0)
    }
  }
}

const isButtonEnabled = (name: keyof EnabledButtons) => {
  return params.value.enabledButtons.hasOwnProperty(name) ? params.value.enabledButtons[name] : true
}

onMounted(createStep)

onUnmounted(removeHighlight)

</script>

<style lang="scss">
@import 'v-step';
</style>

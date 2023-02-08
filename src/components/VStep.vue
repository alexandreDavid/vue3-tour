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
        <button @click.prevent="skip" v-if="!isLast && isButtonEnabled('buttonSkip')"
          class="v-step__button v-step__button-skip">{{ labels.buttonSkip }}</button>
        <button @click.prevent="previousStep" v-if="!isFirst && isButtonEnabled('buttonPrevious')"
          class="v-step__button v-step__button-previous">{{ labels.buttonPrevious }}</button>
        <button @click.prevent="nextStep" v-if="!isLast && isButtonEnabled('buttonNext')"
          class="v-step__button v-step__button-next">{{ labels.buttonNext }}</button>
        <button @click.prevent="finish" v-if="isLast && isButtonEnabled('buttonStop')"
          class="v-step__button v-step__button-stop">{{ labels.buttonStop }}</button>
      </div>
    </slot>

    <div class="v-step__arrow" :class="{ 'v-step__arrow--dark': step.header && step.header.title }" data-popper-arrow></div>
  </div>
  <!-- </teleport> -->
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { createPopper } from '@popperjs/core'
import jump from 'jump.js'
import sum from 'hash-sum'
import { DEFAULT_STEP_OPTIONS, HIGHLIGHT } from '../shared/constants'

export default {
  name: 'v-step',
  props: {
    step: {
      type: Object
    },
    previousStep: {
      type: Function
    },
    nextStep: {
      type: Function
    },
    stop: {
      type: Function
    },
    skip: {
      type: Function,
      default: function () {
        props.stop()
      }
    },
    finish: {
      type: Function,
      default: function () {
        props.stop()
      }
    },
    isFirst: {
      type: Boolean
    },
    isLast: {
      type: Boolean
    },
    labels: {
      type: Object
    },
    displayMask: {
      type: Boolean,
      default: false
    },
    enabledButtons: {
      type: Object
    },
    highlight: {
      type: Boolean
    },
    stopOnFail: {
      type: Boolean
    },
    debug: {
      type: Boolean
    }
  },
  emits: ['targetNotFound'],
  setup(props, context) {
    const hash = sum(props.step.target)
    const targetElement = document.querySelector(props.step.target)

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

      if (isSticky.value) {
        document.body.appendChild(VStep)
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
          context.emit('targetNotFound', props.step)
          if (props.stopOnFail) {
            props.stop()
          }
        }
    }
    }

    const enableScrolling = () => {
      if (params.value.enableScrolling) {
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
      if (isHighlightEnabled()) {
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
      if (isHighlightEnabled()) {
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

    const isButtonEnabled = (name) => {
      return params.value.enabledButtons.hasOwnProperty(name) ? params.value.enabledButtons[name] : true
    }

    onMounted(createStep)

    onUnmounted(removeHighlight)

    return { hash, isButtonEnabled, VStep, isSticky }
  }
}
</script>

<style lang="scss" scoped>
.v-step {
  background: #50596c;
  /* #ffc107, #35495e */
  color: white;
  max-width: 320px;
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  padding: 10px;
  pointer-events: auto;
  text-align: center;
  z-index: 10000;

  &--sticky {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    & .v-step__arrow {
      display: none;
    }
  }
}

.v-step__arrow,
.v-step__arrow::before {
  position: absolute;
  width: 10px;
  height: 10px;
  background: inherit;
}

.v-step__arrow {
  visibility: hidden;

  &--dark {
    &:before {
      background: #454d5d;
    }
  }
}

.v-step__arrow::before {
  visibility: visible;
  content: '';
  transform: rotate(45deg);
}

.v-step[data-popper-placement^="top"]>.v-step__arrow {
  bottom: -5px;
  left: calc(50% - 10px);
}

.v-step[data-popper-placement^="bottom"]>.v-step__arrow {
  top: -5px;
  left: calc(50% - 10px);
}

.v-step[data-popper-placement^="right"]>.v-step__arrow {
  left: -5px;
  top: calc(50% - 10px);
}

.v-step[data-popper-placement^="left"]>.v-step__arrow {
  right: -5px;
  top: calc(50% - 10px);
}

/* Custom */
.v-step__header {
  margin: -10px -10px 5px;
  padding: 5px;
  background-color: #454d5d;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.v-step__content {
  margin: 0 0 10px 0;
}

.v-step__button {
  background: transparent;
  border: .05rem solid white;
  border-radius: .10px;
  color: white;
  cursor: pointer;
  display: inline-block;
  font-size: .8rem;
  height: 1.8rem;
  line-height: 10px;
  outline: none;
  margin: 0 0.2rem;
  padding: .35rem .4rem;
  text-align: center;
  text-decoration: none;
  transition: all .2s ease;
  vertical-align: middle;
  white-space: nowrap;

  &:hover {
    background-color: rgba(white, 0.95);
    color: #50596c;
  }
}

.mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, .5);

  .tour-focus-container {
    border-radius: 4px;
    transition: opacity 0.2s;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 1;
    pointer-events: auto;
    box-shadow: 0px 0px 0px 9999px rgba(17, 55, 80, 0.4), 0px 0px 15px rgba(0, 0, 0, 0.5);
  }
}
</style>

<template>
  <div class="v-tour">
    <slot
      :current-step="currentStep"
      :steps="steps"
      :previous-step="previousStep"
      :next-step="nextStep"
      :stop="stop"
      :skip="skip"
      :finish="finish"
      :is-first="isFirst"
      :is-last="isLast"
      :labels="customOptions.labels"
      :enabled-buttons="customOptions.enabledButtons"
      :highlight="customOptions.highlight"
      :debug="customOptions.debug"
    >
      <!--Default slot {{ currentStep }}-->
      <v-step
        v-if="steps[currentStep]"
        :key="currentStep"
        :step="steps[currentStep]"
        :previous-step="previousStep"
        :next-step="nextStep"
        :stop="stop"
        :skip="skip"
        :finish="finish"
        :is-first="isFirst"
        :is-last="isLast"
        :labels="customOptions.labels"
        :enabled-buttons="customOptions.enabledButtons"
        :highlight="customOptions.highlight"
        :backdrop="customOptions.backdrop"
        :stop-on-fail="customOptions.stopOnTargetNotFound"
        :debug="customOptions.debug"
        @="$emit('targetNotFound', $event)"
        @target-element="setTargetElement"
      >
        <!--<div v-if="index === 2" slot="actions">
          <a @click="nextStep">Next step</a>
        </div>-->
      </v-step>
    </slot>
    <svg class="v-tour__backdrop">
      <!-- eslint-disable max-len -->
      <path
        v-if="customOptions.backdrop"
        :d="`M${viewport?.width},${viewport?.height}H0V0H${viewport?.width}V${viewport?.height}ZM${targetRect?.left},${targetRect?.top}a0,0,0,0,0-0,0V${targetRect?.bottom}a0,0,0,0,0,0,0H${targetRect?.right}a0,0,0,0,0,0-0V${targetRect?.top}a0,0,0,0,0-0-0Z`"
      />
      <!-- eslint-enable max-len -->
    </svg>
  </div>
</template>

<script lang="ts">
  import {
    ref,
    computed,
    onMounted,
    onBeforeUnmount,
    getCurrentInstance,
    defineComponent,
    type PropType,
  } from 'vue';

  import type { Options, Step } from '../shared/types';
  import {
    DEFAULT_CALLBACKS,
    DEFAULT_OPTIONS,
    KEYS,
  } from '../shared/constants';

  export default defineComponent({
    name: 'VTour',
    props: {
      steps: {
        type: Array as PropType<Step[]>,
        default: () => [],
      },
      name: {
        type: String,
        required: true,
      },
      options: {
        type: Object as PropType<Partial<Options>>,
        default: () => {
          return DEFAULT_OPTIONS;
        },
      },
      callbacks: {
        type: Object as PropType<Partial<typeof DEFAULT_CALLBACKS>>,
        default: () => {
          return DEFAULT_CALLBACKS;
        },
      },
    },
    setup(props) {
      console.log(props.options);
      const currentStep = ref(-1);

      const targetElement = ref(null);
      const targetRect = ref({ left: 0, top: 0, bottom: 0, right: 0 });
      const viewport = ref({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
      const setTargetElement = (e) => {
        targetElement.value = e;
      };

      const customOptions = computed(() => {
        return {
          ...DEFAULT_OPTIONS,
          ...props.options,
        };
      });

      const customCallbacks = computed(() => {
        return {
          ...DEFAULT_CALLBACKS,
          ...props.callbacks,
        };
      });

      const isRunning = computed(
        () => currentStep.value > -1 && currentStep.value < numberOfSteps.value,
      );

      const isFirst = computed(() => currentStep.value === 0);

      const isLast = computed(
        () => currentStep.value === props.steps.length - 1,
      );

      const numberOfSteps = computed(() => props.steps.length);

      const step = computed(() => props.steps[currentStep.value]);

      const start = async (startStep: string) => {
        // Wait for the DOM to be loaded, then start the tour
        const startStepIdx =
          typeof startStep !== 'undefined' ? parseInt(startStep, 10) : 0;
        const step = props.steps[startStepIdx];

        const process = () =>
          new Promise<void>((resolve) => {
            setTimeout(() => {
              customCallbacks.value.onStart();
              currentStep.value = startStepIdx;
              resolve();
            }, customOptions.value.startTimeout);
          });
        if (step.before) {
          try {
            await step.before('start');
          } catch (e) {
            return Promise.reject(e);
          }
        }
        await process();
        return Promise.resolve();
      };

      const previousStep = async () => {
        const futureStep = currentStep.value - 1;
        const process = () =>
          new Promise<void>((resolve) => {
            customCallbacks.value.onPreviousStep(currentStep.value);
            currentStep.value = futureStep;
            resolve();
          });
        if (futureStep > -1) {
          const step = props.steps[futureStep];
          if (step.before) {
            try {
              await step.before('previous');
            } catch (e) {
              return Promise.reject(e);
            }
          }
          await process();
        }
        return Promise.resolve();
      };

      const nextStep = async () => {
        const futureStep = currentStep.value + 1;
        const process = () =>
          new Promise<void>((resolve) => {
            customCallbacks.value.onNextStep(currentStep.value);
            currentStep.value = futureStep;
            resolve();
          });
        if (futureStep < numberOfSteps.value && currentStep.value !== -1) {
          const step = props.steps[futureStep];
          if (step.before) {
            try {
              await step.before('next');
            } catch (e) {
              return Promise.reject(e);
            }
          }
          await process();
        }
        return Promise.resolve();
      };

      const stop = () => {
        customCallbacks.value.onStop();
        document.body.classList.remove('v-tour--active');
        currentStep.value = -1;
      };

      const skip = () => {
        customCallbacks.value.onSkip();
        stop();
      };

      const finish = () => {
        customCallbacks.value.onFinish();
        stop();
      };

      const handleScroll = () => {
        targetRect.value = targetElement.value
          ? targetElement.value.getBoundingClientRect()
          : { left: 0, top: 0, right: 0, bottom: 0 };
      };

      const handleResize = () => {
        viewport.value = {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
        };
        handleScroll();
      };

      const handleKeyup = (e: KeyboardEvent) => {
        if (customOptions.value.debug) {
          console.log('[Vue Tour] A keyup event occured:', e);
        }
        switch (e.keyCode) {
          case KEYS.ARROW_RIGHT:
            isKeyEnabled('ARROW_RIGHT') && nextStep();
            break;
          case KEYS.ARROW_LEFT:
            isKeyEnabled('ARROW_LEFT') && previousStep();
            break;
          case KEYS.ESCAPE:
            isKeyEnabled('ESCAPE') && stop();
            break;
        }
      };

      const isKeyEnabled = (key: 'ESCAPE' | 'ARROW_LEFT' | 'ARROW_RIGHT') => {
        const { enabledNavigationKeys } = customOptions.value;
        return Object.prototype.hasOwnProperty.call(enabledNavigationKeys, key)
          ? enabledNavigationKeys[key]
          : true;
      };

      onMounted(() => {
        const app = getCurrentInstance();
        app!.appContext.config.globalProperties.$tours[props.name] = {
          step,
          start,
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
          setTargetElement,
          targetRect,
          viewport,
        };
        if (customOptions.value.useKeyboardNavigation) {
          window.addEventListener('keyup', handleKeyup);
        }
        if (customOptions.value.backdrop) {
          window.addEventListener('scroll', handleScroll);
          window.addEventListener('resize', handleResize);
        }
      });

      onBeforeUnmount(() => {
        if (customOptions.value.useKeyboardNavigation) {
          window.removeEventListener('keyup', handleKeyup);
        }
        if (customOptions.value.backdrop) {
          window.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleResize);
        }
      });

      return {
        customOptions,
        currentStep,
        isFirst,
        isLast,
        previousStep,
        nextStep,
        stop,
        skip,
        finish,
        setTargetElement,
        targetRect,
        viewport,
      };
    },
  });
</script>

<style lang="scss">
  body.v-tour--active {
    pointer-events: none;
  }
  .v-tour {
    pointer-events: auto;
  }
  .v-tour__target--highlighted {
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.4);
    pointer-events: auto;
    z-index: 9999;
    border-radius: 4px;
  }
  .v-tour__target--relative {
    position: relative;
  }
  .v-tour__backdrop {
    display: block;
    vertical-align: middle;
    position: fixed;
    left: 0;
    top: 0;
    height: 0;
    width: 100vw;
    opacity: 0;
    transform: translateZ(0);
    transition:
      all 0.3s ease-out,
      height 0s 0s,
      opacity 0.3s 0s;
    overflow: hidden;
    pointer-events: none;
    z-index: -1;

    &.v-tour__backdrop--active {
      height: 100vh;
      opacity: 0.5;
      z-index: 9997;
    }
  }
</style>

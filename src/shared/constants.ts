import { PopperParams } from '../../types/vue3-tour'

export const DEFAULT_CALLBACKS = {
  onStart: () => {},
  onPreviousStep: () => {},
  onNextStep: () => {},
  onStop: () => {},
  onSkip: () => {},
  onFinish: () => {}
}

export const DEFAULT_OPTIONS = {
  highlight: false,
  labels: {
    buttonSkip: 'Skip tour',
    buttonPrevious: 'Previous',
    buttonNext: 'Next',
    buttonStop: 'Finish'
  },
  enabledButtons: {
    buttonSkip: true,
    buttonPrevious: true,
    buttonNext: true,
    buttonStop: true
  },
  startTimeout: 0,
  useKeyboardNavigation: true,
  enabledNavigationKeys: {
    ESCAPE: true,
    ARROW_RIGHT: true,
    ARROW_LEFT: true
  },
  stopOnTargetNotFound: true,
  debug: false
}

export const HIGHLIGHT = {
  CLASSES: {
    ACTIVE: 'v-tour--active',
    TARGET_HIGHLIGHTED: 'v-tour__target--highlighted',
    TARGET_RELATIVE: 'v-tour__target--relative'
  },
  TRANSITION: 'box-shadow 0s ease-in-out 0s',
  useKeyboardNavigation: true,
  startTimeout: 0,
  stopOnTargetNotFound: true
}

export const DEFAULT_STEP_OPTIONS: PopperParams = {
  enableScrolling: true,
  highlight: DEFAULT_OPTIONS.highlight, // By default use the global tour setting
  enabledButtons: DEFAULT_OPTIONS.enabledButtons,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: ({ placement }: { placement: string }) => {
          if (placement === 'top' || placement === 'bottom') {
            return [0, 8];
          } else {
            return [8, 0];
          }
        },
      },
    },
  ],
  placement: 'bottom',
}

export const KEYS = {
  ARROW_RIGHT: 39,
  ARROW_LEFT: 37,
  ESCAPE: 27
}
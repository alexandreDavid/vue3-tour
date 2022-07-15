import { Modifier, Placement } from "@popperjs/core";

export const DEFAULT_CALLBACKS = {
  onStart: () => {},
  onPreviousStep: (currentStep) => {},
  onNextStep: (currentStep) => {},
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
  debug: false
}

export type Options = typeof DEFAULT_OPTIONS & { stopOnTargetNotFound: boolean };
export type Labels = typeof DEFAULT_OPTIONS.labels;

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

export interface StepOptions {
  enableScrolling: boolean;
  highlight: boolean
  enabledButtons: typeof DEFAULT_OPTIONS.enabledButtons,
  modifiers: Array<Partial<Modifier<any,any>>>,
  placement: Placement
}

export const DEFAULT_STEP_OPTIONS: StepOptions = {
  enableScrolling: true,
  highlight: DEFAULT_OPTIONS.highlight, // By default use the global tour setting
  enabledButtons: DEFAULT_OPTIONS.enabledButtons,
  modifiers: [
    {
      name: 'arrow',
      options: {
        element: '.v-step__arrow'
      }
    },
  ],
  placement: 'bottom'
}

export const KEYS = {
  ARROW_RIGHT: 39,
  ARROW_LEFT: 37,
  ESCAPE: 27
}
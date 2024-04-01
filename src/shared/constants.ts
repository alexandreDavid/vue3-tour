import type { Options, StepOptions } from './types';

export const DEFAULT_CALLBACKS = {
  onStart: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPreviousStep: (currentStep: number) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNextStep: (currentStep: number) => {},
  onStop: () => {},
  onSkip: () => {},
  onFinish: () => {},
};

export const DEFAULT_OPTIONS: Options = {
  highlight: false,
  labels: {
    buttonSkip: 'Skip tour',
    buttonPrevious: 'Previous',
    buttonNext: 'Next',
    buttonStop: 'Finish',
  },
  enabledButtons: {
    buttonSkip: true,
    buttonPrevious: true,
    buttonNext: true,
    buttonStop: true,
  },
  startTimeout: 0,
  useKeyboardNavigation: true,
  enabledNavigationKeys: {
    ESCAPE: true,
    ARROW_RIGHT: true,
    ARROW_LEFT: true,
  },
  debug: false,
};

export const HIGHLIGHT = {
  CLASSES: {
    ACTIVE: 'v-tour--active',
    TARGET_HIGHLIGHTED: 'v-tour__target--highlighted',
    TARGET_RELATIVE: 'v-tour__target--relative',
  },
  TRANSITION: 'box-shadow 0s ease-in-out 0s',
  useKeyboardNavigation: true,
  startTimeout: 0,
  stopOnTargetNotFound: true,
};

export const BACKDROP = {
  CLASSES: {
    SELECTOR: '.v-tour__backdrop',
    ACTIVE: 'v-tour__backdrop--active',
  },
  TRANSITION: 'box-shadow 0s ease-in-out 0s',
  skipOnClickFound: false,
};

export const DEFAULT_STEP_OPTIONS: StepOptions = {
  enableScrolling: true,
  highlight: DEFAULT_OPTIONS.highlight, // By default use the global tour setting
  enabledButtons: DEFAULT_OPTIONS.enabledButtons,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: ({ placement }) => {
          if (placement === 'top' || placement === 'bottom') {
            return [0, 8];
          } else {
            return [8, 0];
          }
        },
      },
    },
    /*{
      name: 'arrow',
      options: {
        element: '.v-step__arrow'
      }
    },*/
  ],
  placement: 'bottom',
};

export const KEYS = {
  ARROW_RIGHT: 39,
  ARROW_LEFT: 37,
  ESCAPE: 27,
};

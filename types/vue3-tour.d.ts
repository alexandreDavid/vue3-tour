import {
  ComputedRef,
  Plugin,
  Ref,
} from 'vue';

import { Placement, Modifier } from '@popperjs/core'

export interface EnabledButtons {
  /**
   * @defaultValue true
   */
  buttonSkip: boolean;
  /**
   * @defaultValue true
   */
  buttonPrevious: boolean;
  /**
   * @defaultValue true
   */
  buttonNext: boolean;
  /**
   * @defaultValue true
   */
  buttonStop: boolean;
}

interface LabelButtons {
  /**
   * @defaultValue 'Skip tour'
   */
  buttonSkip: string;
  /**
   * @defaultValue 'Previous'
   */
  buttonPrevious: string;
  /**
   * @defaultValue 'Next'
   */
  buttonNext: string;
  /**
   * @defaultValue 'Finish'
   */
  buttonStop: string;
}

export interface EnabledNavigationKeys {
  /**
   * @defaultValue true
   */
  ESCAPE: boolean;
  /**
   * @defaultValue true
   */
  ARROW_RIGHT: boolean;
  /**
   * @defaultValue true
   */
  ARROW_LEFT: boolean;
}

type Callback = () => void;
type CallbackWithCurrentStep = (currentStep: number) => void;

/* {{{ Popper */

/**
 * Parameters of Popper element.
 * https://popper.js.org/docs/v1/
 */
export interface PopperParams {
  /**
   * Position of the box relatively to the target element.
   *
   * @defaultValue 'bottom'
   */
  placement?: Placement;

  /**
   * Vue Tour scrolls between each steps if set to true.
   *
   * @defaultValue true
   */
  enableScrolling?: boolean;

  /**
   * Highlights the element showcased by the current step
   *
   * @defaultValue false
   */
  highlight?: boolean;

  /**
   * Do not display buttons if they are set to false.
   */
  enabledButtons?: EnabledButtons;

  /**
   * community modifiers of popper.js
   */
  modifiers?: Modifier[];
}

/* }}} */
/* }}} */
/* {{{ new components */
/* {{{ v-step */

export type StepType = 'start' | 'previous' | 'next';

export interface Step {
  /**
   * Define the main element for this step.
   * This is a DOM selector which should target the element.
   */
  target: string;

  /**
   * The content of the text displayed to user for this step.
   *
   * If not defined a debug content is displayed.
   */
  content?: string;

  /**
   * Define what is displayed in the header part of the step description.
   */
  header?: {
    title?: string;
  };

  /**
   * If defined, a scroll animation is triggered to put the target element
   * into the view.
   * The duration in ms of the scroll is defined by this value.
   *
   * If the animation is triggered and this value is not set, its default
   * value is 1000.
   */
  duration?: number;

  /**
   * Active a scroll animation to put the target element into the view.
   * The offset in px of the scroll relative to the element is defined by
   * this value.
   *
   * @defaultValue 0
   */
  offset?: number;

  /**
   * A callback which is called just before the step is displayed.
   * The step is not laded until the promise is resolved.
   */
  before?: (type: StepType) => Promise<void>;

  /**
   * Different parameters to configure the popper element.
   *
   */
  params?: PopperParams;
}

export interface VStepProps {
  /**
   * The step definition
   */
  step: Step;

  /**
   * Highlights the element showcased by the step
   *
   * @defaultValue false
   */
  highlight?: boolean;

  /**
   * Do not display buttons if they are set to false.
   */
  enabledButtons?: Partial<EnabledButtons>;

  /**
   * If set to true, the tour is stopped if the target is not found.
   *
   * @defaultValue false
   */
  stopOnFail?: boolean;

  /**
   * Called if the tour should be stopped (before the end or at the end)
   */
  stop: Callback;

  /**
   * Called if the tour is finished
   *
   * The default value is the one defined by stop.
   * @defaultValue stop()
   * @wip Not used yet
   */
  finish?: Callback;

  /**
   * Called if the skip action is called.
   *
   * The default value is the one defined by stop.
   * @defaultValue stop()
   * @wip Not used yet
   */
  skip?: Callback;

  /**
   * Called if going to previous step.
   *
   *  @wip Not used yet
   */
  previousStep?: Callback;

  /**
   * Called if going to next step.
   *
   *  @wip Not used yet
   */
  nextStep?: Callback;

  /**
   * Display a mask
   *
   * @defaultValue false
   * @wip Not used yet
   */
  displayMask?: boolean;

  /** @wip Not used yet */
  isFirst?: boolean;

  /** @wip Not used yet */
  isLast?: boolean;

  /**
   * Customize the labels of the tour's buttons for this tep.
   *
   * @wip Not used yet
   */
  labels?: LabelButtons;

  /**
   * Allows you to see logs from the component
   *
   * @defaultValue false
   */
  debug?: boolean;
}

export declare const VStep: {
  new(): {
    $props: VStepProps;
  };
};

/* }}} */
/* {{{ v-tour */

export interface VTourOptions {
  /**
   * Defines the timeout (in ms) before which the tour starts.
   *
   * @defaultValue 0
   */
  startTimeout?: number;

  /**
   * Customize the labels of the tour's buttons.
   */
  labels?: LabelButtons;

  /**
   * Do not display buttons if they are set to false.
   */
  enabledButtons?: EnabledButtons;

  /**
   * Highlights the element showcased by the current step
   *
   * @defaultValue false
   */
  highlight?: boolean;

  /**
   * If set to true you may use the ←, → and ESC keys to navigate through your tour.
   *
   * @defaultValue true
   */
  useKeyboardNavigation?: boolean;

  /**
   * If set to true you may use given key to navigate through your tour.
   */
  enabledNavigationKeys?: EnabledNavigationKeys;

  /**
   * Allows you to see logs from the component
   *
   * @defaultValue false
   */
  debug?: boolean;
}

export interface VTourCallbacks {
  /**
   * The tour is started
   */
  onStart?: Callback;

  /**
   * When goes to a previous step
   */
  onPreviousStep?: CallbackWithCurrentStep;

  /**
   * When goes to a next step
   */
  onNextStep?: CallbackWithCurrentStep;

  /**
   * When the tour is skipped
   */
  onSkip?: Callback;

  /**
   * The tour is finished
   */
  onFinish?: Callback;

  /**
   * The tour has been stopped (for example, when ESC key is pressed)
   */
  onStop?: Callback;
}

export interface VTourProps {
  /**
   * Tour name.
   * This is the identifier used to start it.
   */
  name: string;

  /**
   * List of steps to run when the tour starts
   * @defaultValue []
   */
  steps?: Step[];

  /**
   * Tour options
   *
   * Read VTourOptions description to know default values.
   */
  options?: VTourOptions;

  /**
   * Callbacks which are called when some event happens.
   */
  callbacks?: VTourCallbacks;
}

export declare const VTour: {
  new(): {
    $props: VTourProps;
  };
};

/* {{{ vTour slot */

export interface VTourSlotProps {
  currentStep: number;
  steps: Step[];
  previousStep: CallbackWithCurrentStep;
  nextStep: CallbackWithCurrentStep;
  stop: Callback;
  skip: Callback;
  finish: Callback;
  isFirst: boolean;
  isLast: boolean;
  labels: LabelButtons;
  enabledButtons: EnabledButtons;
  highlight: boolean;
  debug: boolean;
}

export declare const VTourSlot: {
  new(): {
    $props: VTourSlotProps;
  };
};

/* }}} */
/* }}} */
/* {{{ new global Vue property: $tours */

export interface Tour {
  /**
   * Index of the current step.
   */
  currentStep: Ref<number>;

  /**
   * Information about the current step.
   */
  step: ComputedRef<Step>;

  /**
   * Options applied to the current step.
   */
  customOptions: ComputedRef<VTourOptions>;

  /**
   * true if the tour is running.
   */
  isRunning: ComputedRef<boolean>;

  /**
   * true if the current step is the first.
   */
  isFirst: ComputedRef<boolean>;

  /**
   * true if the current step is the last.
   */
  isLast: ComputedRef<boolean>;

  /**
   * Number of steps in the tour.
   */
  numberOfSteps: ComputedRef<number>;

  /* Methods */

  /**
   * Starts the tour.
   *
   * @param startStep If defined, it starts at the given index
   *
   * @return a promise which will be rejected if the step's before
   * callback throws
   */
  start(startStep?: string | number): Promise<void>;

  /**
   * Navigates to the previous step.
   * It does nothing if the tour is already at the first step.
   *
   * @return a promise which will be rejected if the step's before
   * callback throws
   */
  previousStep(): Promise<void>;

  /**
   * Navigates to the next step.
   * It does nothing if the tour is already at the last step.
   *
   * @return a promise which will be rejected if the step's before
   * callback throws
   */
  nextStep(): Promise<void>;

  /**
   * Stops the tour
   */
  stop(): void;

  /**
   * Skips the tour
   */
  skip(): void;

  /**
   * Finishes the tour
   */
  finish(): void;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $tours: Record<string, Tour>;
  }

  function h(type: typeof VStep | 'v-step', props: VStepProps, children?: VNodeNormalizedChildren): VNode;
  function h(type: typeof VTour | 'v-tour', props: VTourProps, children?: typeof VTourSlot): VNode;
}

/* }}} */

declare const vue3Tour: Plugin;

export default vue3Tour;

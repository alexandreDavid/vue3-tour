import type { Modifier, Placement } from '@popperjs/core';

export type ButtonID =
  | 'buttonSkip'
  | 'buttonPrevious'
  | 'buttonNext'
  | 'buttonStop';

export type EnabledButtons = Record<ButtonID, boolean>;

export type Labels = Record<ButtonID, string>;

export interface Options {
  highlight?: false;
  backdrop?: false;
  labels?: Labels;
  enabledButtons?: EnabledButtons;
  startTimeout: number;
  useKeyboardNavigation: boolean;
  enabledNavigationKeys?: {
    ESCAPE: boolean;
    ARROW_RIGHT: boolean;
    ARROW_LEFT: boolean;
  };
  debug?: boolean;
  stopOnTargetNotFound?: boolean;
}

export interface StepOptions {
  enableScrolling?: boolean;
  highlight?: boolean;
  backdrop?: boolean;
  enabledButtons?: EnabledButtons;
  // modifiers?: Array<Partial<Modifier<any, any>>>;
  modifiers?: Array<Partial<Modifier<unknown, unknown>>>;
  placement?: Placement;
}

export interface Step {
  target: string | Ref<HTMLElement | null>;
  header?: {
    title?: string;
  };
  content: string;
  params?: {
    placement?: Placement;
  };
  duration?: unknown;
  offset?: unknown;
  before?: (triggeredBy: 'start' | 'previous' | 'next') => Promise<void>;
}

export interface Tour {
  step: Step;
  start: (startStep: string) => Promise<void>;
  isRunning: boolean;
  customOptions: Options;
  currentStep: number;
  isFirst: boolean;
  isLast: boolean;
  previousStep: () => Promise<void>;
  nextStep: () => Promise<void>;
  stop: () => void;
  skip: () => void;
  finish: () => void;
}

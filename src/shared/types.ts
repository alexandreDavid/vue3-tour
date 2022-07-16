import { Modifier, Placement } from '@popperjs/core';

export type Button = 'buttonSkip' | 'buttonPrevious' | 'buttonNext' | 'buttonStop';

export type EnabledButtons = Record<Button, boolean>;

export type Labels = Record<Button, string>;

export interface Options {
  highlight?: false;
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
  enabledButtons?: EnabledButtons;
  modifiers?: Array<Partial<Modifier<any,any>>>;
  placement?: Placement;
}

export interface Step {
  target: string;
  header?: {
    title?: string;
  },
  content: string;
  params?: {
    placement?: Placement;
  },
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
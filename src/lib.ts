import { Placement } from '@popperjs/core';
import { App } from 'vue';

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



import VTour from './components/VTour.vue'
import VStep from './components/VStep.vue'
import { Options } from './shared/constants';


const install = (app: App) => {
  app.config.globalProperties.$tours = {}

  app.component(VTour.name, VTour)
  app.component(VStep.name, VStep)
}

export default install

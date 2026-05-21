import {CSSTransitionsLesson as Boilerplate} from './boilerplate';
import {CSSTransitionsLesson as Step1} from './step1';
import {CSSTransitionsLesson as Final} from './final';
import type {StepMeta} from '@/components/StepSwitcher';

export const steps: StepMeta[] = [
  {label: 'boilerplate', component: Boilerplate},
  {label: 'step 1', component: Step1},
  {label: 'final', component: Final},
];

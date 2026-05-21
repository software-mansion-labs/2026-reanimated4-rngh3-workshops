import {ScrollAnimationLesson as Boilerplate} from './boilerplate';
import {ScrollAnimationLesson as Step1} from './step1';
import {ScrollAnimationLesson as Step2} from './step2';
import {ScrollAnimationLesson as Final} from './final';
import type {StepMeta} from '@/components/StepSwitcher';

export const steps: StepMeta[] = [
  {label: 'boilerplate', component: Boilerplate},
  {label: 'step 1', component: Step1},
  {label: 'step 2', component: Step2},
  {label: 'final', component: Final},
];

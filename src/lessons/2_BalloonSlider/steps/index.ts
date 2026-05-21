import {BalloonSliderLesson as Boilerplate} from './boilerplate';
import {BalloonSliderLesson as Step1} from './step1';
import {BalloonSliderLesson as Step2} from './step2';
import {BalloonSliderLesson as Step3} from './step3';
import {BalloonSliderLesson as Step4} from './step4';
import {BalloonSliderLesson as Step5} from './step5';
import {BalloonSliderLesson as Final} from './final';
import type {StepMeta} from '@/components/StepSwitcher';

export const steps: StepMeta[] = [
  {label: 'boilerplate', component: Boilerplate},
  {label: 'step 1', component: Step1},
  {label: 'step 2', component: Step2},
  {label: 'step 3', component: Step3},
  {label: 'step 4', component: Step4},
  {label: 'step 5', component: Step5},
  {label: 'final', component: Final},
];

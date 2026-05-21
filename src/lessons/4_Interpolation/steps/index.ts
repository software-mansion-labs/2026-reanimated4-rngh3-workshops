import type {StepMeta} from '@/components/StepSwitcher';
import {Interpolation as Boilerplate} from './boilerplate';
import {Interpolation as Bonus} from './bonus';
import {Interpolation as BonusBoilerplate} from './bonus_boilerplate';
import {Interpolation as BonusSensors} from './bonus_sensors';
import {Interpolation as Final} from './final';
import {Interpolation as Step1} from './step1';
import {Interpolation as Step2} from './step2';
import {Interpolation as Step3} from './step3';

export const steps: StepMeta[] = [
  {label: 'boilerplate', component: Boilerplate},
  {label: 'step 1', component: Step1},
  {label: 'step 2', component: Step2},
  {label: 'step 3', component: Step3},
  {label: 'final', component: Final},
  {label: 'bonus start', component: BonusBoilerplate},
  {label: 'bonus', component: Bonus},
  {label: 'bonus sensors', component: BonusSensors},
];

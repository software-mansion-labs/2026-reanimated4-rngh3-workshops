import {DynamicTabsLesson as Boilerplate} from './boilerplate';
import {DynamicTabsLesson as Step1} from './step1';
import {DynamicTabsLesson as Final} from './final';
import {DynamicTabsLesson as BonusBoilerplate} from './bonus_boilerplate';
import {DynamicTabsLesson as Bonus} from './bonus';
import type {StepMeta} from '@/components/StepSwitcher';

export const steps: StepMeta[] = [
  {label: 'boilerplate', component: Boilerplate},
  {label: 'step 1', component: Step1},
  {label: 'final', component: Final},
  {label: 'bonus start', component: BonusBoilerplate},
  {label: 'bonus', component: Bonus},
];

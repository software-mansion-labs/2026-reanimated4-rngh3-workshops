import { AdvancedLayoutAnimationsLesson as Boilerplate } from "./boilerplate";
import { AdvancedLayoutAnimationsLesson as Step1 } from "./step1";
import { AdvancedLayoutAnimationsLesson as Step2 } from "./step2";
import { AdvancedLayoutAnimationsLesson as Step3 } from "./step3";
import { AdvancedLayoutAnimationsLesson as Final } from "./final";
import { AdvancedLayoutAnimationsLesson as Bonus } from "./bonus";
import type { StepMeta } from "@/components/StepSwitcher";

export const steps: StepMeta[] = [
  { label: "boilerplate", component: Boilerplate },
  { label: "step 1", component: Step1 },
  { label: "step 2", component: Step2 },
  { label: "step 3", component: Step3 },
  { label: "final", component: Final },
  { label: "bonus", component: Bonus },
];

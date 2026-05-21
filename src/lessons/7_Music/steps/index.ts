import type { StepMeta } from "@/components/StepSwitcher";
import { MusicLesson as Boilerplate } from "./boilerplate";
import { MusicLesson as Step1 } from "./step1-LA";
import { MusicLesson as Step2 } from "./step2-LA-transform";
import { MusicLesson as Step3 } from "./step3-gesture";
import { MusicLesson as Step4 } from "./step4-gesture";
import { MusicLesson as Step5 } from "./step5-variant-flip";

export const steps: StepMeta[] = [
  { label: "boilerplate", component: Boilerplate },
  { label: "step 1", component: Step1 },
  { label: "step 2", component: Step2 },
  { label: "step 3", component: Step3 },
  { label: "step 4", component: Step4 },
  { label: "step 5", component: Step5 },
];

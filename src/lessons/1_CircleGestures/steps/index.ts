import { CircleGesturesLesson as Boilerplate } from "./boilerplate";
import { CircleGesturesLesson as Step1 } from "./step1";
import { CircleGesturesLesson as Step2 } from "./step2";
import { CircleGesturesLesson as Final } from "./final";
import type { StepMeta } from "@/components/StepSwitcher";

export const steps: StepMeta[] = [
  { label: "boilerplate", component: Boilerplate },
  { label: "step 1", component: Step1 },
  { label: "step 2", component: Step2 },
  { label: "final", component: Final },
];

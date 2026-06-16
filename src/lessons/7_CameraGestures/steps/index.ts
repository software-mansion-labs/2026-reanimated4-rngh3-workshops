import type { StepMeta } from "@/components/StepSwitcher";
import { CameraGesturesLesson as Boilerplate } from "./boilerplate";
import { CameraGesturesLesson as Final } from "./final";
import { CameraGesturesLesson as Step1 } from "./step1";
import { CameraGesturesLesson as Step2 } from "./step2";

export const steps: StepMeta[] = [
  { label: "boilerplate", component: Boilerplate },
  { label: "step 1", component: Step1 },
  { label: "step 2", component: Step2 },
  { label: "final", component: Final },
];

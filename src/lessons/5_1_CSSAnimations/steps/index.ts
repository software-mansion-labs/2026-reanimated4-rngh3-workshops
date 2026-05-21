import { CSSAnimationsLesson as Boilerplate } from "./boilerplate";
import { CSSAnimationsLesson as Final } from "./final";
import type { StepMeta } from "@/components/StepSwitcher";

export const steps: StepMeta[] = [
  { label: "boilerplate", component: Boilerplate },
  { label: "final", component: Final },
];

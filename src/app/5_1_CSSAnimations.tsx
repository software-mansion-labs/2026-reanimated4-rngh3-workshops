import { StepSwitcher } from "@/components/StepSwitcher";
import { CSSAnimationsLesson } from "@/lessons/5_1_CSSAnimations";
import { steps } from "@/lessons/5_1_CSSAnimations/steps";

export default function Page() {
  return (
    <StepSwitcher
      steps={[{ label: "my work", component: CSSAnimationsLesson }, ...steps]}
    />
  );
}

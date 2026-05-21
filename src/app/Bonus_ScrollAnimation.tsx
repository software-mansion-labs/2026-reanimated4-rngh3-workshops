import { StepSwitcher } from "@/components/StepSwitcher";
import { ScrollAnimationLesson } from "@/lessons/Bonus_ScrollAnimation";
import { steps } from "@/lessons/Bonus_ScrollAnimation/steps";

export default function Page() {
  return (
    <StepSwitcher
      steps={[{ label: "my work", component: ScrollAnimationLesson }, ...steps]}
    />
  );
}

import { StepSwitcher } from "@/components/StepSwitcher";
import { CSSTransitionsLesson } from "@/lessons/5_2_CSSTransitions";
import { steps } from "@/lessons/5_2_CSSTransitions/steps";

export default function Page() {
  return (
    <StepSwitcher
      steps={[{ label: "my work", component: CSSTransitionsLesson }, ...steps]}
    />
  );
}

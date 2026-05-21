import { StepSwitcher } from "@/components/StepSwitcher";
import { DynamicTabsLesson } from "@/lessons/6_DynamicTabs";
import { steps } from "@/lessons/6_DynamicTabs/steps";

export default function Page() {
  return (
    <StepSwitcher
      steps={[{ label: "my work", component: DynamicTabsLesson }, ...steps]}
    />
  );
}

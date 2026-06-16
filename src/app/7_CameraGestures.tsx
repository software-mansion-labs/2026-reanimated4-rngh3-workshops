import { StepSwitcher } from "@/components/StepSwitcher";
import { CameraGestures } from "@/lessons/7_CameraGestures";
import { steps } from "@/lessons/7_CameraGestures/steps";

export default function Page() {
  return (
    <StepSwitcher
      steps={[{ label: "my work", component: CameraGestures }, ...steps]}
    />
  );
}

import { StepSwitcher } from "@/components/StepSwitcher";
import { MusicLesson } from "@/lessons/7_Music";
import { steps } from "@/lessons/7_Music/steps";

export default function Page() {
  return (
    <StepSwitcher
      steps={[{ label: "my work", component: MusicLesson }, ...steps]}
    />
  );
}

import {StepSwitcher} from '@/components/StepSwitcher';
import {CircleGesturesLesson} from '@/lessons/1_CircleGestures';
import {steps} from '@/lessons/1_CircleGestures/steps';

export default function Page() {
  return (
    <StepSwitcher
      steps={[{label: 'my work', component: CircleGesturesLesson}, ...steps]}
    />
  );
}

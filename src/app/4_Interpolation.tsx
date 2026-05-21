import {StepSwitcher} from '@/components/StepSwitcher';
import {Interpolation} from '@/lessons/4_Interpolation';
import {steps} from '@/lessons/4_Interpolation/steps';

export default function Page() {
  return (
    <StepSwitcher
      steps={[{label: 'my work', component: Interpolation}, ...steps]}
    />
  );
}

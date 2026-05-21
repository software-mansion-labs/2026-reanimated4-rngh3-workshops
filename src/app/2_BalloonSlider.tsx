import {StepSwitcher} from '@/components/StepSwitcher';
import {BalloonSliderLesson} from '@/lessons/2_BalloonSlider';
import {steps} from '@/lessons/2_BalloonSlider/steps';

export default function Page() {
  return (
    <StepSwitcher
      steps={[{label: 'my work', component: BalloonSliderLesson}, ...steps]}
    />
  );
}

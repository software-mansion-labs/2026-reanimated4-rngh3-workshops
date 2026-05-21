import {StepSwitcher} from '@/components/StepSwitcher';
import {AdvancedLayoutAnimationsLesson} from '@/lessons/3_FABButton/AdvancedLayoutAnimations';
import {steps} from '@/lessons/3_FABButton/steps';

export default function Page() {
  return (
    <StepSwitcher
      steps={[
        {label: 'my work', component: AdvancedLayoutAnimationsLesson},
        ...steps,
      ]}
      // The FAB sits at bottom:80 — push the pill above it
      bottomOffset={100}
    />
  );
}

import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  lessons: [
    {type: 'link', href: '/prerequisites', label: 'Prerequisites & Setup'},
    {type: 'doc', id: '1_CircleGestures/README', label: '1. Circle Gestures'},
    {type: 'doc', id: '2_BalloonSlider/README', label: '2. Balloon Slider'},
    {type: 'doc', id: '3_FABButton/README', label: '3. FAB Button'},
    {type: 'doc', id: '4_Interpolation/README', label: '4. Interpolation'},
    {type: 'doc', id: '5_1_CSSAnimations/README', label: '5.1 CSS Animations'},
    {type: 'doc', id: '5_2_CSSTransitions/README', label: '5.2 CSS Transitions'},
    {type: 'doc', id: '6_DynamicTabs/README', label: '6. Dynamic Tabs'},
    {type: 'doc', id: 'Bonus_ScrollAnimation/README', label: 'Bonus: Scroll Animation'},
  ],
};

export default sidebars;

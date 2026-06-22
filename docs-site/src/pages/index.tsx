import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './index.module.css';

const lessons = [
  { num: '01', label: 'Circle Gestures', to: '/docs/1_CircleGestures' },
  { num: '02', label: 'Balloon Slider', to: '/docs/2_BalloonSlider' },
  { num: '03', label: 'FAB Button', to: '/docs/3_FABButton' },
  { num: '04', label: 'Interpolation', to: '/docs/4_Interpolation' },
  { num: '5.1', label: 'CSS Animations', to: '/docs/5_1_CSSAnimations' },
  { num: '5.2', label: 'CSS Transitions', to: '/docs/5_2_CSSTransitions' },
  { num: '06', label: 'Dynamic Tabs', to: '/docs/6_DynamicTabs' },
  { num: '07', label: 'Camera Gestures', to: '/docs/7_CameraGestures' },
  { num: '08', label: 'Music', to: '/docs/8_Music' },
  { num: 'B', label: 'Scroll Animation', to: '/docs/Bonus_ScrollAnimation' },
];

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            {siteConfig.title}
          </Heading>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/prerequisites">
              Prerequisites & Setup
            </Link>
            <Link
              className="button button--primary button--lg"
              to="/docs/1_CircleGestures"
              style={{ marginLeft: '1rem' }}>
              Start Lesson 1 →
            </Link>
          </div>
        </div>
      </header>
      <main className="container margin-vert--xl">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Lessons
        </Heading>
        <div className="row">
          {lessons.map(({ num, label, to }) => (
            <div key={num} className="col col--3 margin-bottom--md">
              <Link to={to} className={clsx('card padding--md', styles.lessonCard)}>
                <span className={styles.lessonNum}>{num}</span>
                <span className={styles.lessonLabel}>{label}</span>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}

import {AppIcon} from '@/components/AppIcon';
import {apps} from '@/lib/apps';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {scheduleOnRN} from 'react-native-worklets';
import Animated, {CSSAnimationKeyframes} from 'react-native-reanimated';

const shake: CSSAnimationKeyframes = {
  from: {
    transform: [{rotateZ: '2deg'}],
  },
  '15%': {
    transform: [{rotateZ: '-2deg'}],
  },
  '30%': {
    transform: [{rotateZ: '2deg'}],
  },
  '45%': {
    transform: [{rotateZ: '-2deg'}],
  },
  '60%': {
    transform: [{rotateZ: '2deg'}],
  },
  '75%': {
    transform: [{rotateZ: '-2deg'}],
  },
  to: {
    transform: [{rotateZ: '0deg'}],
  },
};

export function CSSAnimationsLesson() {
  const [isEditMode, setEditMode] = useState(false);

  const longPress = Gesture.LongPress().onStart(() => {
    scheduleOnRN(setEditMode, true);
  });

  const tap = Gesture.Tap().onStart(() => {
    scheduleOnRN(setEditMode, false);
  });

  const composed = Gesture.Exclusive(longPress, tap);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composed}>
        <Animated.View
          style={[
            isEditMode && {
              animationName: shake,
              animationDuration: 700,
              animationIterationCount: 'infinite',
            },
          ]}
        >
          <AppIcon app={apps[0]} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    [process.env.EXPO_OS === 'web'
      ? 'backgroundImage'
      : 'experimental_backgroundImage']:
      'linear-gradient(180deg,rgba(125, 211, 252, 1) 0%, rgba(29, 78, 216, 1) 100%)',
  },
});

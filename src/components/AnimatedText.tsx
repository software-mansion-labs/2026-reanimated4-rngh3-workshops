import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native';
import Animated, {
  AnimatedStyle,
  SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';

Animated.addWhitelistedNativeProps({text: true});

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function AnimatedText({
  style,
  text,
  label = '',
  decimals = 0,
}: {
  style?: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  label?: string;
  decimals?: number;
  text: SharedValue<number>;
}): React.ReactElement {
  const animatedProps = useAnimatedProps(() => {
    return {
      text: `${label}${text.value.toFixed(decimals)}`,
    } as unknown as TextInputProps;
  });

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      value={`${label}${text.value.toFixed(decimals)}`}
      style={[styles.text, style]}
      animatedProps={animatedProps}
      multiline={false}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'black',
    flexGrow: 1,
    width: '100%',
    textAlign: 'center',
  },
});

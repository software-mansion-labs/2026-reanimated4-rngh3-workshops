import { Pressable } from "react-native";
import { Image } from "expo-image";
import Animated, {
  LinearTransition,
  withSpring,
  withTiming,
  type LayoutAnimationFunction,
} from "react-native-reanimated";

export const playerLayout = LinearTransition.duration(500).springify();

export const createScaledTextLayout = (
  currentScale: number,
  targetScale: number,
): LayoutAnimationFunction => {
  return (values) => {
    "worklet";

    return {
      initialValues: {
        originX: values.currentOriginX,
        originY: values.currentOriginY,
        width: values.currentWidth,
        height: values.currentHeight,
        transform: [{ scale: currentScale }],
      },
      animations: {
        originX: withSpring(values.targetOriginX),
        originY: withSpring(values.targetOriginY),
        width: withSpring(values.targetWidth),
        height: withSpring(values.targetHeight),
        transform: [{ scale: withSpring(targetScale) }],
      },
    };
  };
};

export const titleToMiniLayout = createScaledTextLayout(1, 0.64);
export const titleToFullLayout = createScaledTextLayout(0.64, 1);
export const artistToMiniLayout = createScaledTextLayout(1, 0.75);
export const artistToFullLayout = createScaledTextLayout(0.75, 1);

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const AnimatedImage = Animated.createAnimatedComponent(Image);

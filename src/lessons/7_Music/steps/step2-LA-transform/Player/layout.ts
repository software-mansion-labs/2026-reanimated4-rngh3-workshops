import { Image } from "expo-image";
import { Pressable } from "react-native";
import Animated, {
  LinearTransition,
  withSpring,
  type LayoutAnimationFunction,
} from "react-native-reanimated";

export const playerLayout = LinearTransition.duration(500).springify();

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const AnimatedImage = Animated.createAnimatedComponent(Image);

const LAYOUT_DURATION_MS = 300;

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
        originX: withSpring(values.targetOriginX, {
          duration: LAYOUT_DURATION_MS,
        }),
        originY: withSpring(values.targetOriginY, {
          duration: LAYOUT_DURATION_MS,
        }),
        width: withSpring(values.targetWidth, { duration: LAYOUT_DURATION_MS }),
        height: withSpring(values.targetHeight, {
          duration: LAYOUT_DURATION_MS,
        }),
        transform: [
          { scale: withSpring(targetScale, { duration: LAYOUT_DURATION_MS }) },
        ],
      },
    };
  };
};

export const titleToMiniLayout = createScaledTextLayout(1, 0.64);
export const titleToFullLayout = createScaledTextLayout(0.64, 1);
export const artistToMiniLayout = createScaledTextLayout(1, 0.75);
export const artistToFullLayout = createScaledTextLayout(0.75, 1);

import Animated, {
  LinearTransition,
  withTiming,
  type LayoutAnimationFunction,
} from "react-native-reanimated";

export const playerLayout = LinearTransition.duration(500).springify();

const LAYOUT_DURATION_MS = 500;

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
        originX: withTiming(values.targetOriginX, { duration: LAYOUT_DURATION_MS }),
        originY: withTiming(values.targetOriginY, { duration: LAYOUT_DURATION_MS }),
        width: withTiming(values.targetWidth, { duration: LAYOUT_DURATION_MS }),
        height: withTiming(values.targetHeight, { duration: LAYOUT_DURATION_MS }),
        transform: [{ scale: withTiming(targetScale, { duration: LAYOUT_DURATION_MS }) }],
      },
    };
  };
};

export const titleToMiniLayout = createScaledTextLayout(1, 0.64);
export const titleToFullLayout = createScaledTextLayout(0.64, 1);
export const artistToMiniLayout = createScaledTextLayout(1, 0.75);
export const artistToFullLayout = createScaledTextLayout(0.75, 1);

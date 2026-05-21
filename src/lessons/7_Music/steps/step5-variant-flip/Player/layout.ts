import { Image } from "expo-image";
import Animated from "react-native-reanimated";

export const VELOCITY_SNAP_THRESHOLD = 280;
export const PAN_ACTIVATION_THRESHOLD = 10;
export const SNAP_EXPAND_THRESHOLD = 0.5;

export const AnimatedImage = Animated.createAnimatedComponent(Image);

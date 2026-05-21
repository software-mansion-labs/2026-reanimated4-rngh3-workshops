import { Pressable } from "react-native";
import { Image } from "expo-image";
import Animated, { LinearTransition } from "react-native-reanimated";

export const playerLayout = LinearTransition.duration(500).springify();

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const AnimatedImage = Animated.createAnimatedComponent(Image);

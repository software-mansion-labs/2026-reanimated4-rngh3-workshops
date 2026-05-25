import { Image } from "expo-image";
import { StyleSheet, type ViewStyle } from "react-native";
import Animated, {
  FadeIn,
  LayoutAnimationConfig,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useAnimationMeta } from "@/lessons/7_Music/shared/animationMeta";

import { spacing } from "@/lessons/7_Music/shared/data";
import { usePlayer, useVariant } from "./PlayerProvider";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function PlayerArtwork() {
  const { state } = usePlayer();
  const { progress } = useAnimationMeta();
  const variant = useVariant();

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    borderRadius: interpolate(progress.value, [0, 1], [4, 8]),
  }));

  if (!state.currentSong) {
    return null;
  }

  const variantStyle = variantStyles[variant];

  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View
        key={variant}
        entering={FadeIn}
        style={variantStyle.container}
      >
        <Animated.View style={[styles.artwork, animatedStyle]}>
          <AnimatedImage
            source={state.currentSong.artwork}
            style={fill}
            contentFit="cover"
          />
        </Animated.View>
      </Animated.View>
    </LayoutAnimationConfig>
  );
}

const fill = StyleSheet.absoluteFill;

const styles = StyleSheet.create({
  artwork: {
    aspectRatio: 1,
    width: "100%",
    maxHeight: "100%",
    alignSelf: "center",
    overflow: "hidden",
  },
});

const variantStyles = {
  mini: StyleSheet.create({
    container: {
      paddingVertical: spacing.two,
      paddingLeft: spacing.two,
    },
  }),
  full: StyleSheet.create({
    container: {
      flex: 1,
      minHeight: 200,
      width: "100%",
      justifyContent: "center",
    },
  }),
};

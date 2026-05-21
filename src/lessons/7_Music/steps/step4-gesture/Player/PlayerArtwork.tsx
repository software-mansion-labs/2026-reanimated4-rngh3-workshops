import { StyleSheet, type ViewStyle } from "react-native";
import Animated, {
  FadeIn,
  LayoutAnimationConfig,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { usePlayer, useVariant } from "./PlayerProvider";
import { AnimatedImage } from "./layout";

export function PlayerArtwork() {
  const variant = useVariant();
  const { state, meta } = usePlayer();

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    borderRadius: interpolate(meta!.progress!.value, [0, 1], [4, 8]),
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
      aspectRatio: 1,
      height: "80%",
    },
  }),
  full: StyleSheet.create({
    container: {
      flex: 1,
      minHeight: 200,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
  }),
} as const;

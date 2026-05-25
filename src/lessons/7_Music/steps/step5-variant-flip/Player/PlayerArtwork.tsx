import { StyleSheet, type ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Image } from "expo-image";
import { useVariantFlip } from "../useVariantFlip";
import { usePlayer, useVariant } from "./PlayerProvider";

export function PlayerArtwork() {
  const variant = useVariant();
  const { state, meta } = usePlayer();
  const { targetRef, flipStyle } = useVariantFlip(variant);

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    borderRadius: interpolate(meta!.progress!.value, [0, 1], [4, 8]),
  }));

  if (!state.currentSong) {
    return null;
  }

  const variantStyle = variantStyles[variant];

  return (
    <Animated.View style={variantStyle.container}>
      <Animated.View
        ref={targetRef}
        collapsable={false}
        style={[styles.artwork, animatedStyle, flipStyle]}
      >
        <Image
          source={state.currentSong.artwork}
          style={fill}
          contentFit="cover"
        />
      </Animated.View>
    </Animated.View>
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
};

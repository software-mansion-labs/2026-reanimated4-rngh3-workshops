import { Image } from "expo-image";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { useAnimationMeta } from "@/lessons/7_Music/shared/animationMeta";

import { spacing } from "@/lessons/7_Music/shared/data";
import { useVariantFlip } from "../useVariantFlip";
import { usePlayer } from "./PlayerProvider";

export function PlayerArtwork() {
  const { state } = usePlayer();
  const { progress } = useAnimationMeta();
  const { targetRef, flipStyle } = useVariantFlip(state.variant);

  const animatedStyle = useAnimatedStyle<ViewStyle>(() => ({
    borderRadius: interpolate(progress.value, [0, 1], [4, 8]),
  }));

  if (!state.currentSong) {
    return null;
  }

  const variantStyle = variantStyles[state.variant];

  return (
    <View style={variantStyle.container}>
      <Animated.View
        ref={targetRef}
        style={[styles.artwork, animatedStyle, flipStyle]}
      >
        <Image
          source={state.currentSong.artwork}
          style={fill}
          contentFit="cover"
        />
      </Animated.View>
    </View>
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

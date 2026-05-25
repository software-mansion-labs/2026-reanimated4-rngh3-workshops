import Icon from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet } from "react-native";

import { colors } from "@/lessons/7_Music/shared/data";

import { stopPress, usePlayer } from "./PlayerProvider";

export function PlayerPrevButton() {
  const { state, actions } = usePlayer();

  if (state.variant === "mini") {
    return null;
  }

  return (
    <Pressable
      hitSlop={12}
      onPress={(event) => stopPress(event, actions.playPrevious)}
      style={styles.sideButton}
    >
      <Icon name="play-skip-back" size={28} color={colors.text} />
    </Pressable>
  );
}

export function PlayerPlayPauseButton() {
  const { state, actions } = usePlayer();
  const variantStyle = variantStyles[state.variant];
  const icon = variantIcon[state.variant];

  return (
    <Pressable
      hitSlop={12}
      onPress={(event) => stopPress(event, actions.togglePlay)}
      style={variantStyle.button}
    >
      <Icon
        name={state.isPlaying ? "pause" : "play"}
        size={icon.size}
        color={icon.color}
      />
    </Pressable>
  );
}

export function PlayerNextButton() {
  const { state, actions } = usePlayer();

  if (state.variant === "mini") {
    return null;
  }

  return (
    <Pressable
      hitSlop={12}
      onPress={(event) => stopPress(event, actions.playNext)}
      style={styles.sideButton}
    >
      <Icon name="play-skip-forward" size={28} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sideButton: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});

const variantStyles = {
  mini: StyleSheet.create({
    button: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },
  }),
  full: StyleSheet.create({
    button: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.text,
      alignItems: "center",
      justifyContent: "center",
    },
  }),
};

const variantIcon = {
  mini: {
    size: 18,
    color: colors.text,
  },
  full: {
    size: 32,
    color: colors.background,
  },
} as const;

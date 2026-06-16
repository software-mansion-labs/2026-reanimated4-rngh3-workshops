import Icon from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { colors, formatDuration, spacing } from "@/lessons/8_Music/shared/data";

import { stopPress, usePlayer } from "./PlayerProvider";

function PlayerCollapseButton() {
  const { state, actions } = usePlayer();

  if (state.variant === "mini") {
    return null;
  }

  return (
    <Pressable
      hitSlop={12}
      onPress={(event) => stopPress(event, actions.collapse)}
      style={styles.side}
    >
      <Icon name="chevron-down" size={28} color={colors.text} />
    </Pressable>
  );
}

export function PlayerHeader() {
  const { state } = usePlayer();

  if (state.variant === "mini") {
    return null;
  }

  return (
    <Animated.View entering={FadeIn} style={styles.header}>
      <PlayerCollapseButton />
      <View style={styles.center}>
        <Text style={styles.label}>PLAYING FROM PLAYLIST</Text>
        <Text style={styles.title}>Liked Slops</Text>
      </View>
      <View style={styles.side} />
    </Animated.View>
  );
}

export function PlayerScrubber() {
  const { state } = usePlayer();

  if (state.variant === "mini" || !state.currentSong) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn} style={styles.scrubber}>
      <View style={styles.track}>
        <View style={styles.fill} />
      </View>
      <View style={styles.labels}>
        <Text style={styles.text}>0:00</Text>
        <Text style={styles.text}>
          {formatDuration(state.currentSong.duration)}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  side: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  scrubber: {
    gap: spacing.one,
  },
  track: {
    height: 3,
    backgroundColor: colors.divider,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    width: "30%",
    height: "100%",
    backgroundColor: colors.text,
  },
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    color: colors.textSecondary,
    fontSize: 11,
    fontVariant: ["tabular-nums"],
  },
});

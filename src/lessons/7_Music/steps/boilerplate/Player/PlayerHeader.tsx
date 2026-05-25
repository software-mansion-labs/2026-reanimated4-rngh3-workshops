import Icon from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { stopPress, usePlayer, useVariant } from "./PlayerProvider";
import { colors, formatDuration, spacing } from "@/lessons/7_Music/shared/data";

function PlayerCollapseButton() {
  const { actions } = usePlayer();
  const variant = useVariant();

  if (variant === "mini") {
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
  const variant = useVariant();

  if (variant === "mini") {
    return null;
  }

  return (
    <View style={styles.header}>
      <PlayerCollapseButton />
      <View style={styles.center}>
        <Text style={styles.label}>PLAYING FROM PLAYLIST</Text>
        <Text style={styles.title}>Liked Slops</Text>
      </View>
      <View style={styles.side} />
    </View>
  );
}

export function PlayerScrubber() {
  const { state } = usePlayer();
  const variant = useVariant();

  if (variant === "mini" || !state.currentSong) {
    return null;
  }

  return (
    <View style={styles.scrubber}>
      <View style={styles.track}>
        <View style={styles.fill} />
      </View>
      <View style={styles.labels}>
        <Text style={styles.text}>0:00</Text>
        <Text style={styles.text}>{formatDuration(state.currentSong.duration)}</Text>
      </View>
    </View>
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

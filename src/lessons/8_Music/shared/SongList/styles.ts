import { StyleSheet } from "react-native";

import { colors, spacing } from "../data";

export const styles = StyleSheet.create({
  listHeader: {
    paddingHorizontal: spacing.three,
    paddingBottom: spacing.four,
    gap: spacing.one,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  listTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
  },
  listSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  songRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.two,
    gap: spacing.three,
  },
  songRowPressed: {
    backgroundColor: colors.surface,
  },
  songArtwork: {
    width: 56,
    height: 56,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  songMeta: {
    flex: 1,
    gap: 2,
  },
  songTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
  },
  songTitleActive: {
    color: colors.accent,
  },
  songArtist: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  songDuration: {
    color: colors.textSecondary,
    fontSize: 13,
    fontVariant: ["tabular-nums"],
  },
});

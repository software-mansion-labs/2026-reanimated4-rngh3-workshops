import { createContext, useContext, type ReactNode } from "react";
import { type GestureResponderEvent } from "react-native";

import type { Song } from "../data";

export type PlayerVariant = "mini" | "full";
export type PlayerLayoutState = "mini" | "to-full" | "full" | "to-mini";

export type PlayerState = {
  currentSong: Song | null;
  isPlaying: boolean;
  isExpanded?: boolean;
  variant?: PlayerVariant;
  layoutState?: PlayerLayoutState;
};

export type PlayerActions = {
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  expand: () => void;
  collapse: () => void;
};

export type PlayerContextValue = {
  state: PlayerState;
  actions: PlayerActions;
};

export const PlayerContext = createContext<PlayerContextValue | null>(null);
export const VariantContext = createContext<PlayerVariant>("mini");

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("Music components must be used within PlayerProvider.");
  }

  return context;
}

export function useVariant() {
  return useContext(VariantContext);
}

export function stopPress(event: GestureResponderEvent, onPress: () => void) {
  event.stopPropagation();
  onPress();
}

export function PlayerVariantProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: PlayerVariant;
}) {
  return (
    <VariantContext.Provider value={value}>{children}</VariantContext.Provider>
  );
}

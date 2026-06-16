import { createContext, useContext } from "react";
import { type GestureResponderEvent } from "react-native";

import type { Song } from "../data";

export type PlayerVariant = "mini" | "full";

export type PlayerState = {
  currentSong: Song | null;
  isPlaying: boolean;
  variant: PlayerVariant;
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

export function usePlayer() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("Music components must be used within PlayerProvider.");
  }

  return context;
}

export function stopPress(event: GestureResponderEvent, onPress: () => void) {
  event.stopPropagation();
  onPress();
}

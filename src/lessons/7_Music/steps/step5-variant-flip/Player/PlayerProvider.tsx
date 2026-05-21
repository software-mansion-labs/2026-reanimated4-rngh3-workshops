import { useRef, useState, type ReactNode } from "react";
import {
  useAnimatedReaction,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import {
  PlayerContext,
  type FlipCaptureCallback,
  type PlayerContextValue,
  type PlayerLayoutState,
  type PlayerVariant,
} from "@/lessons/7_Music/shared/context";
import { songs, type Song } from "@/lessons/7_Music/shared/data";

export {
  PlayerVariantProvider,
  stopPress,
  usePlayer,
  useVariant,
  type PlayerVariant,
} from "@/lessons/7_Music/shared/context";

const LOW = 0.2;
const HIGH = 0.3;

type DeadbandEvent = "low-up" | "high-up" | "high-down" | "low-down";

function variantForLayoutState(layoutState: PlayerLayoutState): PlayerVariant {
  return layoutState === "to-full" || layoutState === "full" ? "full" : "mini";
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(songs[0] ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [layoutState, setLayoutState] = useState<PlayerLayoutState>("mini");
  const flipCaptureCallbacksRef = useRef(new Set<FlipCaptureCallback>());
  const layoutStateRef = useRef<PlayerLayoutState>("mini");
  const transitionQueueRef = useRef(Promise.resolve());

  const progress = useSharedValue(0);
  const variant = variantForLayoutState(layoutState);

  const registerFlipCapture = (callback: FlipCaptureCallback) => {
    flipCaptureCallbacksRef.current.add(callback);

    return () => {
      flipCaptureCallbacksRef.current.delete(callback);
    };
  };

  const captureFlipTargets = () => {
    return Promise.all(
      Array.from(flipCaptureCallbacksRef.current, (callback) => callback()),
    );
  };

  const reduceLayoutState = (
    state: PlayerLayoutState,
    event: DeadbandEvent,
  ): PlayerLayoutState => {
    switch (event) {
      case "low-up":
        return state === "mini" ? "to-full" : state;
      case "high-up":
        return state === "to-full" || state === "to-mini" ? "full" : state;
      case "high-down":
        return state === "full" ? "to-mini" : state;
      case "low-down":
        return state === "to-full" || state === "to-mini" ? "mini" : state;
    }
  };

  const transitionLayout = (event: DeadbandEvent) => {
    transitionQueueRef.current = transitionQueueRef.current.then(async () => {
      const currentState = layoutStateRef.current;
      const nextState = reduceLayoutState(currentState, event);
      const currentVariant = variantForLayoutState(currentState);
      const nextVariant = variantForLayoutState(nextState);

      if (nextState === currentState) {
        return;
      }

      if (nextVariant !== currentVariant) {
        await captureFlipTargets();
      }

      layoutStateRef.current = nextState;
      setLayoutState(nextState);
    });
  };

  useAnimatedReaction(
    () => progress.value,
    (curr, prev) => {
      if (prev === null) {
        return;
      }

      if (prev <= LOW && curr > LOW) {
        scheduleOnRN(transitionLayout, "low-up");
      }
      if (prev < HIGH && curr >= HIGH) {
        scheduleOnRN(transitionLayout, "high-up");
      }
      if (prev >= HIGH && curr < HIGH) {
        scheduleOnRN(transitionLayout, "high-down");
      }
      if (prev > LOW && curr <= LOW) {
        scheduleOnRN(transitionLayout, "low-down");
      }
    },
  );

  const shift = (delta: number) => {
    setCurrentSong((song) => {
      if (!song) {
        return songs[0] ?? null;
      }

      const index = songs.findIndex((candidate) => candidate.id === song.id);
      const nextIndex = (index + delta + songs.length) % songs.length;
      return songs[nextIndex] ?? song;
    });
    setIsPlaying(true);
  };

  const value: PlayerContextValue = {
    state: {
      currentSong,
      isPlaying,
      variant,
      layoutState,
    },
    actions: {
      playSong: (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
      },
      togglePlay: () => setIsPlaying((playing) => !playing),
      playNext: () => shift(1),
      playPrevious: () => shift(-1),
      expand: () => {
        progress.value = withSpring(1, { duration: 500 });
      },
      collapse: () => {
        progress.value = withSpring(0, { duration: 500 });
      },
    },
    meta: {
      progress,
      registerFlipCapture,
    },
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

import { useRef, useState, type ReactNode } from "react";
import {
  useAnimatedReaction,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import {
  AnimationMetaContext,
  type FlipCaptureCallback,
} from "@/lessons/7_Music/shared/animationMeta";
import {
  PlayerContext,
  type PlayerContextValue,
  type PlayerVariant,
} from "@/lessons/7_Music/shared/context";
import { songs, type Song } from "@/lessons/7_Music/shared/data";

export {
  stopPress,
  usePlayer,
  type PlayerVariant,
} from "@/lessons/7_Music/shared/context";

const SWAP = 0.2;

export function PlayerProvider({ children }: { children: ReactNode }) {
  const progress = useSharedValue(0);
  const flipCaptureCallbacksRef = useRef(new Set<FlipCaptureCallback>());
  const [currentSong, setCurrentSong] = useState<Song | null>(songs[0] ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [variant, setVariant] = useState<PlayerVariant>("mini");
  const variantRef = useRef<PlayerVariant>("mini");
  const transitionQueueRef = useRef(Promise.resolve());

  const registerFlipCapture = (callback: FlipCaptureCallback) => {
    flipCaptureCallbacksRef.current.add(callback);

    return () => {
      flipCaptureCallbacksRef.current.delete(callback);
    };
  };

  const captureFlipTargets = () =>
    Promise.all(
      Array.from(flipCaptureCallbacksRef.current, (callback) => callback()),
    ).then(() => undefined);

  const swapVariant = (nextVariant: PlayerVariant) => {
    transitionQueueRef.current = transitionQueueRef.current.then(async () => {
      if (variantRef.current === nextVariant) {
        return;
      }

      await captureFlipTargets();

      variantRef.current = nextVariant;
      setVariant(nextVariant);
    });
  };

  useAnimatedReaction(
    () => progress.value,
    (curr, prev) => {
      if (prev === null) {
        return;
      }

      if (prev < SWAP && curr >= SWAP) {
        scheduleOnRN(swapVariant, "full");
      }
      if (prev >= SWAP && curr < SWAP) {
        scheduleOnRN(swapVariant, "mini");
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
  };

  return (
    <AnimationMetaContext.Provider
      value={{ progress, registerFlipCapture, captureFlipTargets }}
    >
      <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
    </AnimationMetaContext.Provider>
  );
}

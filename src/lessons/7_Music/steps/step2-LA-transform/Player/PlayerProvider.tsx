import { useMemo, useState, type ReactNode } from "react";

import {
  PlayerContext,
  type PlayerContextValue,
} from "@/lessons/7_Music/shared/context";
import { songs, type Song } from "@/lessons/7_Music/shared/data";

export {
  PlayerVariantProvider,
  stopPress,
  usePlayer,
  useVariant,
  type PlayerVariant,
} from "@/lessons/7_Music/shared/context";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(songs[0] ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const value = useMemo<PlayerContextValue>(() => {
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

    return {
      state: {
        currentSong,
        isPlaying,
        isExpanded,
      },
      actions: {
        playSong: (song) => {
          setCurrentSong(song);
          setIsPlaying(true);
        },
        togglePlay: () => setIsPlaying((playing) => !playing),
        playNext: () => shift(1),
        playPrevious: () => shift(-1),
        expand: () => setIsExpanded(true),
        collapse: () => setIsExpanded(false),
      },
    };
  }, [currentSong, isExpanded, isPlaying]);

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

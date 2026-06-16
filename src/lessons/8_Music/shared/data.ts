import type { ImageSourcePropType } from "react-native";

export const colors = {
  background: "#121212",
  surface: "#181818",
  surfaceElevated: "#282828",
  text: "#FFFFFF",
  textSecondary: "#B3B3B3",
  accent: "#1DB954",
  divider: "#2A2A2A",
} as const;

export const spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
} as const;

export const MINI_PLAYER_HEIGHT = 64;

export type Song = {
  id: string;
  title: string;
  artist: string;
  duration: number;
  artwork: ImageSourcePropType;
};

export const songs: Song[] = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: 200,
    artwork: require("./assets/artwork/music-1.jpg"),
  },
  {
    id: "2",
    title: "Levitating",
    artist: "Dua Lipa",
    duration: 203,
    artwork: require("./assets/artwork/music-2.jpg"),
  },
  {
    id: "3",
    title: "Save Your Tears",
    artist: "The Weeknd",
    duration: 215,
    artwork: require("./assets/artwork/music-3.jpg"),
  },
  {
    id: "4",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    duration: 174,
    artwork: require("./assets/artwork/music-4.jpg"),
  },
  {
    id: "5",
    title: "good 4 u",
    artist: "Olivia Rodrigo",
    duration: 178,
    artwork: require("./assets/artwork/music-5.jpg"),
  },
  {
    id: "6",
    title: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    duration: 141,
    artwork: require("./assets/artwork/music-6.jpg"),
  },
  {
    id: "7",
    title: "As It Was",
    artist: "Harry Styles",
    duration: 167,
    artwork: require("./assets/artwork/music-7.jpg"),
  },
  {
    id: "8",
    title: "Heat Waves",
    artist: "Glass Animals",
    duration: 238,
    artwork: require("./assets/artwork/music-8.jpg"),
  },
  {
    id: "9",
    title: "Industry Baby",
    artist: "Lil Nas X, Jack Harlow",
    duration: 212,
    artwork: require("./assets/artwork/music-9.jpg"),
  },
  {
    id: "10",
    title: "Bad Habit",
    artist: "Steve Lacy",
    duration: 232,
    artwork: require("./assets/artwork/music-10.jpg"),
  },
];

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

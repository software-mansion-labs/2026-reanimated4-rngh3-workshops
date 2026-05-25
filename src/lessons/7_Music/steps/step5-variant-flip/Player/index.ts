import { PlayerProvider } from "./PlayerProvider";
import { PlayerArtwork } from "./PlayerArtwork";
import { PlayerArtist } from "./PlayerArtist";
import { PlayerControls } from "./PlayerControls";
import { PlayerHeader, PlayerScrubber } from "./PlayerHeader";
import { PlayerMeta } from "./PlayerMeta";
import { PlayerSheet } from "./PlayerSheet";
import { PlayerTitle } from "./PlayerTitle";
import {
  PlayerNextButton,
  PlayerPlayPauseButton,
  PlayerPrevButton,
} from "./PlayerButtons";

export const Player = {
  Provider: PlayerProvider,
  Sheet: PlayerSheet,
  Header: PlayerHeader,
  Artwork: PlayerArtwork,
  Meta: PlayerMeta,
  Title: PlayerTitle,
  Artist: PlayerArtist,
  Scrubber: PlayerScrubber,
  Controls: PlayerControls,
  PrevButton: PlayerPrevButton,
  PlayPauseButton: PlayerPlayPauseButton,
  NextButton: PlayerNextButton,
};

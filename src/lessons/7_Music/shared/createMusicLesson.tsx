import { type ComponentType, type ReactNode } from "react";
import { View } from "react-native";

import { SongList } from "./SongList/SongList";
import { screenStyles } from "./styles/screen";

export type PlayerModule = {
  Provider: ComponentType<{ children: ReactNode }>;
  Sheet: ComponentType<{ children: ReactNode }>;
  Header: ComponentType;
  Artwork: ComponentType;
  Meta: ComponentType<{ children: ReactNode }>;
  Title: ComponentType;
  Artist: ComponentType;
  Scrubber: ComponentType;
  Controls: ComponentType<{ children: ReactNode }>;
  PrevButton: ComponentType;
  PlayPauseButton: ComponentType;
  NextButton: ComponentType;
};

export function createMusicLesson(Player: PlayerModule) {
  function MusicApp() {
    return (
      <View style={screenStyles.screen}>
        <SongList />
        <Player.Sheet>
          <Player.Header />
          <Player.Artwork />
          <Player.Meta>
            <Player.Title />
            <Player.Artist />
          </Player.Meta>
          <Player.Scrubber />
          <Player.Controls>
            <Player.PrevButton />
            <Player.PlayPauseButton />
            <Player.NextButton />
          </Player.Controls>
        </Player.Sheet>
      </View>
    );
  }

  return function MusicLesson() {
    return (
      <Player.Provider>
        <MusicApp />
      </Player.Provider>
    );
  };
}

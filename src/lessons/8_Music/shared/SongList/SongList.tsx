import { FlatList, Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePlayer } from "../context";
import { MINI_PLAYER_HEIGHT, formatDuration, songs, spacing } from "../data";
import { styles } from "./styles";

function SongRow({
  song,
  isActive,
  onPress,
}: {
  song: (typeof songs)[number];
  isActive: boolean;
  onPress: (song: (typeof songs)[number]) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(song)}
      style={({ pressed }) => [
        styles.songRow,
        pressed && styles.songRowPressed,
      ]}
    >
      <Image source={song.artwork} style={styles.songArtwork} />
      <View style={styles.songMeta}>
        <Text
          style={[styles.songTitle, isActive && styles.songTitleActive]}
          numberOfLines={1}
        >
          {song.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {song.artist}
        </Text>
      </View>
      <Text style={styles.songDuration}>{formatDuration(song.duration)}</Text>
    </Pressable>
  );
}

export function SongList() {
  const insets = useSafeAreaInsets();
  const { state, actions } = usePlayer();

  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.four,
        paddingBottom: insets.bottom + MINI_PLAYER_HEIGHT + spacing.four,
      }}
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <Text style={styles.eyebrow}>SLOPTIFY</Text>
          <Text style={styles.listTitle}>Liked Slops</Text>
          <Text style={styles.listSubtitle}>
            {songs.length} algorithmically blessed songs
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <SongRow
          song={item}
          isActive={state.currentSong?.id === item.id}
          onPress={actions.playSong}
        />
      )}
    />
  );
}

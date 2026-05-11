import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}

export default Layout;

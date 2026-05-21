import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";

function Layout() {
  return (
    <KeyboardProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </GestureHandlerRootView>
    </KeyboardProvider>
  );
}

export default Layout;

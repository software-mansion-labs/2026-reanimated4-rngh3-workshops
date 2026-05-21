import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";

LogBox.ignoreLogs([
  "DevLoadingView.showMessage called with too many arguments, expected up to 3, got 4",
]);

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

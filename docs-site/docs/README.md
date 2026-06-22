---
title: Prerequisites & Setup
---

# The Reanimated + Gesture Handler Workshop

## Hosted by

- Jakub Piasecki ([@breskin67](https://x.com/breskin67))
- Bartłomiej Błoniarz ([@BBloniarz\_](https://x.com/BBloniarz_))

## Setup

This is a normal Expo app. Clone it, install dependencies, then choose how you want to run it on a simulator, emulator, or physical device.

We recommend sticking to one setup for the whole workshop so you do not have to repeat steps mid-session. If you use a simulator or emulator, make sure it is installed and configured first.

### Clone & install

1. Clone the repo:

```bash
git clone git@github.com:software-mansion-labs/2026-reanimated4-rngh3-workshops.git && cd 2026-reanimated4-rngh3-workshops
```

2. Install project dependencies (from the project root):

```bash
bun install
```

### Two ways to run the project

**Development build :** You build (or download) a custom dev client once. After that, day-to-day work is just `bun start` and opening that client. The initial build takes longer, but you get much better error messages when something goes wrong. **If you are reading this before the workshops, this is the recommended setup.**

**Expo Go:** No native build required. Run `bun start` and connect. On an **iOS Simulator** or **Android Emulator**, Expo CLI installs Expo Go for you — no App Store or Play Store needed. On a physical device, install Expo Go manually or connect an Android phone via USB and let the CLI install it.

---

## Option 1: Development build

A development build is a custom version of this app with all workshop native dependencies included. You install it once, then reuse it for the rest of the workshop.

### Build or install the dev client

Pick the target you will use:

#### iOS Simulator

```bash
bun ios
```

#### Android Emulator

```bash
bun android
```

#### Physical iOS device

1. Connect your iPhone or iPad via USB
2. Generate native projects:

```bash
bun expo prebuild
```

3. Open the iOS project in Xcode:

```bash
xed ios
```

4. Select your device from the run destination menu
5. In **AppjsWorkshop2026 → Signing & Capabilities**, select your Apple team and create a signing certificate
6. Build and run with the Play button in Xcode (or `Cmd + R`)
7. After the app is signed once, you can also run:

```bash
bun ios -d
```

and select your device from the list.

See [Setup Xcode signing](https://github.com/expo/fyi/blob/main/setup-xcode-signing.md) if you run into signing issues.

#### Physical Android device

1. Enable USB debugging on your device and connect it via USB
2. Generate native projects:

```bash
bun expo prebuild
```

3. Build and install on the connected device:

```bash
bun android -d
```

Select your physical device from the list.

> [!TIP]
> To set up a local development environment for running on Android and iOS, follow [this guide](https://docs.expo.dev/get-started/set-up-your-environment/).

### Run the app with a development build

1. Start the Metro bundler:

```bash
bun start
```

2. Open the **AppjsWorkshop2026** dev client on your simulator, emulator, or device
3. The app should connect automatically. If it does not:
   - Press `s` to switch to the development build mode
   - **iOS Simulator:** press `i` in the terminal
   - **Android Emulator:** press `a` in the terminal

After the first build, you only need to repeat these run steps — not the build step — unless native dependencies change.

---

## Option 2: Expo Go (quick start)

Expo Go lets you run the project without building native code. On an iOS Simulator or Android Emulator, Expo CLI downloads and installs Expo Go for you.

### Run the app with Expo Go

1. Start the Metro bundler:

```bash
bun start
```

2. Connect Expo Go to the running dev server:

#### iOS Simulator

Press `i` in the terminal. Expo CLI opens the iOS Simulator, installs Expo Go if needed, and launches the project.

Or in one step:

```bash
bun start --ios
```

#### Android Emulator

Press `a` in the terminal. Expo CLI opens the Android Emulator, installs Expo Go if needed, and launches the project.

Or in one step:

```bash
bun start --android
```

#### Physical iOS device

Follow the instructions [here](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=physical), though in that case it might be easier to just go with a development build.

#### Physical Android device

1. Enable USB debugging on your device and connect it to your computer
2. Run `bun start` and press `a` — Expo CLI installs Expo Go on the device if needed and launches the project

---

## Tools and libraries

During the workshop we will be using primarily:

- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## Next step

**Go to: [Circle Gestures](./src/lessons/1_CircleGestures/)**

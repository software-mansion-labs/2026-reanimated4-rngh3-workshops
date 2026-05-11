import { hitSlop } from "@/lib/reanimated";
import { colors, layout } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
  KeyboardState,
  LinearTransition,
  MeasuredDimensions,
  SharedValue,
  StyleProps,
  interpolate,
  measure,
  runOnJS,
  runOnUI,
  scrollTo,
  useAnimatedKeyboard,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

const TABS = ["For you", "Following"];

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

type Tweet = {
  id: string;
  avatar: string;
  name: string;
  handle: string;
  time: string;
  content: string;
  imageUri?: string;
  linkPreview?: { text: string; domain: string };
  replies: number;
  retweets: number;
  likes: string;
  views: string;
};

const tweets: Tweet[] = [
  {
    id: "1",
    avatar: "https://i.pravatar.cc/48?img=1",
    name: "Name",
    handle: "@handle",
    time: "0m",
    content: "Thats it. thats the tweet.",
    replies: 11,
    retweets: 270,
    likes: "1,869",
    views: "99.6k",
  },
  {
    id: "2",
    avatar: "https://i.pravatar.cc/48?img=5",
    name: "Name",
    handle: "@handle",
    time: "0m",
    content: "Thats it. thats the tweet.",
    imageUri: "https://picsum.photos/seed/tweet2/400/220",
    linkPreview: {
      text: "What is this link? We may never know. Then again, maybe we will know some...",
      domain: "example.com",
    },
    replies: 11,
    retweets: 270,
    likes: "1,869",
    views: "99.6k",
  },
  {
    id: "3",
    avatar: "https://i.pravatar.cc/48?img=9",
    name: "Name",
    handle: "@handle",
    time: "0m",
    content: "Thats it. thats the tweet.",
    replies: 11,
    retweets: 270,
    likes: "1,869",
    views: "99.6k",
  },
  {
    id: "4",
    avatar: "https://i.pravatar.cc/48?img=12",
    name: "Name",
    handle: "@handle",
    time: "0m",
    content: "Thats it. thats the tweet.",
    imageUri: "https://picsum.photos/seed/tweet4/400/220",
    replies: 11,
    retweets: 270,
    likes: "1,869",
    views: "99.6k",
  },
  {
    id: "5",
    avatar: "https://i.pravatar.cc/48?img=15",
    name: "Name",
    handle: "@handle",
    time: "0m",
    content: "Thats it. thats the tweet.",
    replies: 11,
    retweets: 270,
    likes: "1,869",
    views: "99.6k",
  },
  {
    id: "6",
    avatar: "https://i.pravatar.cc/48?img=20",
    name: "Name",
    handle: "@handle",
    time: "0m",
    content: "Thats it. thats the tweet.",
    imageUri: "https://picsum.photos/seed/tweet6/400/220",
    linkPreview: {
      text: "What is this link? We may never know. Then again, maybe we will know some...",
      domain: "example.com",
    },
    replies: 11,
    retweets: 270,
    likes: "1,869",
    views: "99.6k",
  },
  {
    id: "7",
    avatar: "https://i.pravatar.cc/48?img=25",
    name: "Name",
    handle: "@handle",
    time: "0m",
    content: "Thats it. thats the tweet.",
    replies: 11,
    retweets: 270,
    likes: "1,869",
    views: "99.6k",
  },
  {
    id: "8",
    avatar: "https://i.pravatar.cc/48?img=30",
    name: "Name",
    handle: "@handle",
    time: "0m",
    content: "Thats it. thats the tweet.",
    imageUri: "https://picsum.photos/seed/tweet8/400/220",
    replies: 11,
    retweets: 270,
    likes: "1,869",
    views: "99.6k",
  },
];

// ---------------------------------------------------------------------------
// Tab bar  (DynamicTabs lesson pattern)
// ---------------------------------------------------------------------------

type TabProps = {
  name: string;
  isActiveTabIndex: boolean;
  onActive: (measurements: MeasuredDimensions) => void;
};

const Tab = memo(({ name, isActiveTabIndex, onActive }: TabProps) => {
  const tabRef = useAnimatedRef<View>();

  const sendMeasurements = () => {
    runOnUI(() => {
      const measurements = measure(tabRef);
      runOnJS(onActive)(measurements!);
    })();
  };

  useEffect(() => {
    if (isActiveTabIndex) sendMeasurements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActiveTabIndex]);

  return (
    <View
      ref={tabRef}
      style={styles.tab}
      onLayout={() => {
        if (isActiveTabIndex) sendMeasurements();
      }}>
      <Pressable
        hitSlop={hitSlop}
        onPress={sendMeasurements}
        style={styles.tabTouchable}>
        <Text style={[styles.tabText, isActiveTabIndex && styles.tabTextActive]}>
          {name}
        </Text>
      </Pressable>
    </View>
  );
});

function Indicator({
  measurements,
}: {
  measurements: SharedValue<MeasuredDimensions | null>;
}) {
  const stylez = useAnimatedStyle(() => {
    if (!measurements.value) return { opacity: 0 };
    const { x, width } = measurements.value;
    return {
      opacity: 1,
      left: withTiming(x),
      width: withTiming(width),
    };
  });
  return <Animated.View style={[styles.indicator, stylez]} />;
}

// ---------------------------------------------------------------------------
// Tweet item
// ---------------------------------------------------------------------------

function TweetActions({ item }: { item: Tweet }) {
  return (
    <View style={styles.actions}>
      <View style={styles.actionItem}>
        <Feather name="message-circle" size={15} color="#666" />
        <Text style={styles.actionText}>{item.replies}</Text>
      </View>
      <View style={styles.actionItem}>
        <Feather name="repeat" size={15} color="#666" />
        <Text style={styles.actionText}>{item.retweets}</Text>
      </View>
      <View style={styles.actionItem}>
        <Feather name="heart" size={15} color="#666" />
        <Text style={styles.actionText}>{item.likes}</Text>
      </View>
      <View style={styles.actionItem}>
        <Feather name="bar-chart-2" size={15} color="#666" />
        <Text style={styles.actionText}>{item.views}</Text>
      </View>
      <Feather name="upload" size={15} color="#666" />
    </View>
  );
}

function TweetItem({ item }: { item: Tweet }) {
  return (
    <View style={styles.tweet}>
      <View style={styles.tweetRow}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.tweetContent}>
          <Text style={styles.tweetMeta} numberOfLines={1}>
            <Text style={styles.tweetName}>{item.name}</Text>
            <Text style={styles.tweetHandle}>
              {" "}
              {item.handle} · {item.time}
            </Text>
          </Text>
          <Text style={styles.tweetText}>{item.content}</Text>
          {item.imageUri && (
            <>
              <Image
                source={{ uri: item.imageUri }}
                style={styles.tweetImage}
                resizeMode="cover"
              />
              {item.linkPreview && (
                <View style={styles.linkPreview}>
                  <Text style={styles.linkText} numberOfLines={2}>
                    {item.linkPreview.text}
                  </Text>
                  <Text style={styles.linkDomain}>{item.linkPreview.domain}</Text>
                </View>
              )}
            </>
          )}
          <TweetActions item={item} />
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// FadingCell — CellRendererComponent that reads absolute y from FlatList's
// positioning style and fades the cell as it approaches the top of the viewport.
// ---------------------------------------------------------------------------

type FadingCellProps = {
  style?: StyleProps;
  children: React.ReactNode;
  scrollY: SharedValue<number>;
  tabsHeight: SharedValue<number>;
};

function FadingCell({
  style,
  children,
  scrollY,
  tabsHeight,
  ...rest
}: FadingCellProps) {
  const yOffset = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      yOffset.value - scrollY.value,
      [-tabsHeight.value, 0],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <Animated.View
      style={[style, animStyle]}
      onLayout={(e) => {
        yOffset.value = e.nativeEvent.layout.y;
      }}
      {...rest}>
      {children}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// TweetPage — one page of the horizontal pager, owns its own scrollY so each
// tab's scroll position is independent.
// ---------------------------------------------------------------------------

type TweetPageProps = {
  tabsHeight: SharedValue<number>;
};

function TweetPage({ tabsHeight }: TweetPageProps) {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  // Stable component reference — SharedValues never change identity so [] is correct.
  const CellRenderer = useCallback(
    ({ style, children, ...props }: any) => (
      <FadingCell style={style} scrollY={scrollY} tabsHeight={tabsHeight} {...props}>
        {children}
      </FadingCell>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Animated.FlatList
      data={tweets}
      keyExtractor={(item) => item.id}
      onScroll={onScroll}
      scrollEventThrottle={1000 / 60}
      CellRendererComponent={CellRenderer as any}
      renderItem={({ item }) => <TweetItem item={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      style={{ width: SCREEN_WIDTH }}
    />
  );
}

// ---------------------------------------------------------------------------
// Compose FAB  (AdvancedLayoutAnimations lesson pattern)
// ---------------------------------------------------------------------------

const _fabSize = 56;
const _fabSpacing = layout.spacing * 2;
const _fabOpenWidth = SCREEN_WIDTH - _fabSpacing * 2;
const _fabDuration = 400;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ComposeFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const keyboard = useAnimatedKeyboard();

  const keyboardStyle = useAnimatedStyle(() => ({
    marginBottom:
      keyboard.state.value === KeyboardState.OPEN
        ? keyboard.height.value - _fabSpacing
        : 0,
  }));

  return (
    <Animated.View
      style={[styles.fab, keyboardStyle]}
      layout={LinearTransition.duration(_fabDuration)}>
      <View style={styles.fabRow}>
        {isOpen && (
          <Animated.Text
            style={styles.fabTitle}
            entering={FadeInDown.duration(_fabDuration)}
            exiting={FadeOutDown.duration(_fabDuration)}>
            New tweet
          </Animated.Text>
        )}
        <AnimatedPressable
          onPress={() => setIsOpen((v) => !v)}
          layout={LinearTransition.duration(_fabDuration)}>
          {isOpen ? (
            <Animated.View
              key="close"
              entering={FadeIn.duration(_fabDuration)}
              exiting={FadeOut.duration(_fabDuration)}>
              <Feather name="x" size={24} color="#fff" />
            </Animated.View>
          ) : (
            <Animated.View
              key="compose"
              entering={FadeIn.duration(_fabDuration)}
              exiting={FadeOut.duration(_fabDuration)}>
              <Feather name="edit-2" size={22} color="#fff" />
            </Animated.View>
          )}
        </AnimatedPressable>
      </View>

      {isOpen && (
        <Animated.View
          entering={FadeInDown.duration(_fabDuration)}
          exiting={FadeOutDown.duration(_fabDuration)}
          style={styles.fabBody}>
          <View style={styles.composeRow}>
            <Image
              source={{ uri: "https://i.pravatar.cc/48?img=1" }}
              style={styles.composeAvatar}
            />
            <TextInput
              style={styles.composeInput}
              placeholder="What is happening?!"
              placeholderTextColor="rgba(255,255,255,0.45)"
              multiline
              autoFocus
            />
          </View>
          <View style={styles.composeFooter}>
            <View style={styles.composeTools}>
              <Feather name="image" size={20} color="rgba(255,255,255,0.8)" />
              <Feather name="film" size={20} color="rgba(255,255,255,0.8)" />
              <Feather name="smile" size={20} color="rgba(255,255,255,0.8)" />
              <Feather name="map-pin" size={20} color="rgba(255,255,255,0.8)" />
            </View>
            <Pressable
              style={styles.postButton}
              onPress={() => setIsOpen(false)}>
              <Text style={styles.postButtonText}>Post</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export function TwitterFeedLesson() {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabsHeight = useSharedValue(0);
  const tabMeasurements = useSharedValue<MeasuredDimensions | null>(null);
  const tabsScrollRef = useAnimatedRef<ScrollView>();
  // Plain ref for the horizontal pager — we only need imperative scrollToIndex
  const pagerRef = useRef<FlatList>(null);

  const handleTabBarLayout = (e: LayoutChangeEvent) => {
    tabsHeight.value = e.nativeEvent.layout.height;
  };

  // Scroll the tab bar ScrollView so the active tab is centred
  const scrollToTab = () => {
    runOnUI(() => {
      const dims = measure(tabsScrollRef);
      if (!dims || !tabMeasurements.value) return;
      scrollTo(
        tabsScrollRef,
        tabMeasurements.value.x -
          (dims.width - tabMeasurements.value.width) / 2,
        0,
        true
      );
    })();
  };

  // Tab pressed or active-tab changed → scroll both the tab bar and the pager
  const handleTabActive = (index: number, measurements: MeasuredDimensions) => {
    tabMeasurements.value = measurements;
    setSelectedTab(index);
    scrollToTab();
    pagerRef.current?.scrollToIndex({ index, animated: true });
  };

  // Pager swiped → update selected tab (Tab useEffect picks it up and sends measurements)
  const handlePagerScrollEnd = (e: any) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );
    setSelectedTab(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky tab bar */}
      <View onLayout={handleTabBarLayout}>
        <ScrollView
          ref={tabsScrollRef as any}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}>
          {TABS.map((tab, index) => (
            <Tab
              key={tab}
              name={tab}
              isActiveTabIndex={index === selectedTab}
              onActive={(measurements) => handleTabActive(index, measurements)}
            />
          ))}
          <Indicator measurements={tabMeasurements} />
        </ScrollView>
        <View style={styles.tabsDivider} />
      </View>

      {/* Horizontal pager — one TweetPage per tab (DynamicTabs bonus pattern) */}
      <FlatList
        ref={pagerRef}
        data={TABS}
        keyExtractor={(tab) => tab}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={1000 / 60}
        onMomentumScrollEnd={handlePagerScrollEnd}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={() => <TweetPage tabsHeight={tabsHeight} />}
        style={styles.pager}
      />

      <ComposeFAB />
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const AVATAR_SIZE = 44;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Tabs
  tabsContent: {
    flexDirection: "row",
  },
  tab: {
    flex: 1,
    minWidth: 80,
  },
  tabTouchable: {
    paddingVertical: layout.spacing * 1.5,
    paddingHorizontal: layout.spacing * 2,
    alignItems: "center",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#555",
  },
  tabTextActive: {
    color: "#000",
    fontWeight: "700",
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.blue,
  },
  tabsDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e0e0e0",
  },
  // Pager
  pager: {
    flex: 1,
  },
  // Tweet
  tweet: {
    paddingHorizontal: layout.spacing * 2,
    paddingVertical: layout.spacing * 1.5,
  },
  tweetRow: {
    flexDirection: "row",
    gap: layout.spacing * 1.5,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#eee",
  },
  tweetContent: {
    flex: 1,
    gap: layout.spacing * 0.5,
  },
  tweetMeta: {
    fontSize: 14,
  },
  tweetName: {
    fontWeight: "700",
    color: "#000",
  },
  tweetHandle: {
    color: "#555",
  },
  tweetText: {
    fontSize: 14,
    color: "#0f0f0f",
    lineHeight: 20,
  },
  tweetImage: {
    width: "100%",
    height: 200,
    borderRadius: layout.radius * 1.5,
    marginTop: layout.spacing,
    backgroundColor: "#eee",
  },
  linkPreview: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    borderBottomLeftRadius: layout.radius * 1.5,
    borderBottomRightRadius: layout.radius * 1.5,
    padding: layout.spacing,
    marginTop: -layout.radius,
    paddingTop: layout.spacing + layout.radius,
    backgroundColor: "#fafafa",
  },
  linkText: {
    fontSize: 13,
    color: "#444",
    lineHeight: 18,
  },
  linkDomain: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: layout.spacing,
    paddingRight: layout.spacing,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    color: "#666",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e8e8e8",
  },
  // FAB
  fab: {
    position: "absolute",
    bottom: _fabSpacing,
    right: _fabSpacing,
    backgroundColor: colors.blue,
    borderRadius: _fabSize / 2,
    padding: _fabSpacing * 0.75,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: _fabSize - _fabSpacing * 1.5,
    gap: layout.spacing * 2,
  },
  fabTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  fabBody: {
    marginTop: layout.spacing,
    width: _fabOpenWidth - _fabSpacing * 1.5,
    gap: layout.spacing,
  },
  composeRow: {
    flexDirection: "row",
    gap: layout.spacing,
    alignItems: "flex-start",
  },
  composeAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccc",
  },
  composeInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
    minHeight: 80,
    textAlignVertical: "top",
  },
  composeFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: layout.spacing,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  composeTools: {
    flexDirection: "row",
    gap: layout.spacing * 1.5,
  },
  postButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: layout.spacing * 2,
    paddingVertical: layout.spacing * 0.75,
  },
  postButtonText: {
    color: colors.blue,
    fontWeight: "700",
    fontSize: 14,
  },
});

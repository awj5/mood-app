import React, { useEffect, useRef, useState } from "react";
import { View, Text, useColorScheme } from "react-native";
import * as Device from "expo-device";
import PagerView from "react-native-pager-view";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import Entry from "./journal/Entry";
import { CheckInType } from "types";
import { getTheme } from "utils/helpers";

type JournalProps = {
  checkIns: CheckInType[];
};

export default function Journal(props: JournalProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const pagerViewRef = useRef<PagerView>(null);
  const [entries, setEntries] = useState<CheckInType[]>();
  const [initPage, setInitPage] = useState(0);
  const [page, setPage] = useState(0);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    setEntries(undefined); // Reset
    const checkIns: CheckInType[] = [];

    // Get check-ins with notes
    for (const checkIn of props.checkIns) {
      if (checkIn.note) checkIns.push(checkIn);
    }

    setInitPage(Math.max(0, checkIns.length - 1)); // Set here because Android doesn't like it being set in component prop

    // Hack! - Force PagerView to re-mount so initialPage is updated
    requestAnimationFrame(() => {
      setEntries(checkIns);
    });

    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          flex: 1,
          aspectRatio: Device.deviceType !== 1 ? "4/3" : "4/4",
          backgroundColor: theme.color.invertedOpaqueBg,
          borderRadius: theme.spacing.base,
        },
      ]}
    >
      <View style={{ padding: theme.spacing.base, paddingBottom: 0 }}>
        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: theme.color.inverted,
            fontSize: theme.fontSize.xSmall,
          }}
          allowFontScaling={false}
        >
          JOURNAL
        </Text>

        {Device.deviceType === 1 ? (
          <Svg
            width="22"
            height="28"
            viewBox="0 0 22 28"
            fill={theme.color.inverted}
            style={{ position: "absolute", right: theme.spacing.base }}
          >
            <Path d="M21.7778 28L10.8889 21.7778L0 28V3.11111V0H3.11111H18.6667H21.7778V3.11111V28Z" />
          </Svg>
        ) : (
          <Svg
            width="32"
            height="40"
            viewBox="0 0 32 40"
            fill={theme.color.inverted}
            style={{ position: "absolute", right: theme.spacing.base }}
          >
            <Path d="M31.1111 40L15.5556 31.1111L0 40V4.44444V0H4.44445H26.6667H31.1111V4.44444V40Z" />
          </Svg>
        )}
      </View>

      {entries?.length ? (
        <>
          <View style={{ flex: 1, paddingBottom: entries.length === 1 ? theme.spacing.base : 0 }}>
            <PagerView
              ref={pagerViewRef}
              initialPage={initPage}
              overdrag={true}
              onPageSelected={(e) => setPage(e.nativeEvent.position)}
              style={{ flex: 1 }}
            >
              {entries.map((item) => (
                <Entry key={item.id} checkIn={item} />
              ))}
            </PagerView>
          </View>

          {entries.length > 1 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: theme.spacing.small / 2,
                paddingVertical: theme.spacing.small,
              }}
            >
              {entries.slice(-10).map((item, index) => {
                const originalIndex = entries.findIndex((entry) => entry.id === item.id);
                const selected = (index === 0 && page <= originalIndex) || page === originalIndex; // Keep first dot selected if showing entry that is greater than latest 10

                return (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: selected ? theme.color.inverted : theme.color.opaqueBg,
                      borderRadius: 999,
                      width: theme.spacing.small / 2,
                      aspectRatio: "1/1",
                    }}
                  />
                );
              })}
            </View>
          )}
        </>
      ) : (
        entries && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: theme.spacing.base,
            }}
          >
            <Text
              style={{
                color: theme.color.invertedOpaque,
                fontSize: theme.fontSize.small,
                fontFamily: "Circular-Book",
                textAlign: "center",
              }}
              allowFontScaling={false}
            >
              Summaries of your chats with <Text style={{ fontFamily: "Circular-Bold" }}>MOOD</Text> will appear here
            </Text>
          </View>
        )
      )}
    </Animated.View>
  );
}

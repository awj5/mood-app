import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { CheckInType } from "data/database";
import { theme, pressedDefault } from "utils/helpers";

type JournalProps = {
  checkIns: CheckInType[];
};

export default function Journal(props: JournalProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [entries, setEntries] = useState<CheckInType[]>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const invertedColor = colors.primary === "white" ? "black" : "white";
  const iconSize = Device.deviceType !== 1 ? 32 : 24;
  const iconStroke = Device.deviceType !== 1 ? 2.5 : 2;
  const fontSize = Device.deviceType !== 1 ? 20 : 14;

  const convertDate = (date: Date) => {
    const today = new Date();
    const year = today.getFullYear();
    const newDate = new Date(date);
    return newDate.toDateString().replace(` ${year}`, "");
  };

  useEffect(() => {
    const checkIns = [];

    // Get check-ins with summaries
    for (let i = 0; i < props.checkIns.length; i++) {
      let checkIn = props.checkIns[i];
      if (checkIn.note) checkIns.push(checkIn); // Check-in has note
    }

    setEntries(checkIns);
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View
      style={{
        flex: 1,
        aspectRatio: Device.deviceType !== 1 ? "4/3" : "4/4",
        backgroundColor: colors.primary !== "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
        borderRadius: spacing,
        opacity,
      }}
    >
      {entries?.length ? (
        <>
          <View style={[styles.header, { padding: Device.deviceType !== 1 ? 20 : 12 }]}>
            <Pressable
              onPress={() => alert("Coming soon")}
              style={({ pressed }) => pressedDefault(pressed)}
              hitSlop={12}
            >
              <ChevronLeft color={invertedColor} size={iconSize} absoluteStrokeWidth strokeWidth={iconStroke} />
            </Pressable>

            <Text
              style={{
                fontFamily: "Circular-Bold",
                color: invertedColor,
                fontSize: Device.deviceType !== 1 ? 16 : 12,
                textTransform: "uppercase",
              }}
              allowFontScaling={false}
            >
              {convertDate(entries[0].date)}
            </Text>

            <Pressable
              onPress={() => alert("Coming soon")}
              style={({ pressed }) => pressedDefault(pressed)}
              hitSlop={12}
            >
              <ChevronRight color={invertedColor} size={iconSize} absoluteStrokeWidth strokeWidth={iconStroke} />
            </Pressable>
          </View>

          <View style={{ flex: 1, padding: spacing }}>
            <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ paddingBottom: spacing }}>
              <Text
                style={{
                  fontFamily: "Circular-BookItalic",
                  color: invertedColor,
                  fontSize: fontSize,
                }}
                allowFontScaling={false}
              >
                {entries[0].note}
              </Text>
            </ScrollView>
          </View>
        </>
      ) : (
        <View style={[styles.empty, { padding: spacing }]}>
          <Text
            style={[
              styles.text,
              {
                color: invertedColor,
                fontSize: fontSize,
              },
            ]}
            allowFontScaling={false}
          >
            Your chat summaries with MOOD will appear here.
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 0,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Circular-Book",
    opacity: 0.5,
    textAlign: "center",
  },
});

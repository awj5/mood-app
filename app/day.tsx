import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Device from "expo-device";
import { BlurView } from "expo-blur";
import { useSQLiteContext } from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import Animated, { Easing, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import MoodsData from "data/moods.json";
import CheckIn from "components/day/CheckIn";
import { CheckInType, CheckInMoodType } from "types";
import { theme } from "utils/helpers";

export default function Day() {
  const params = useLocalSearchParams<{ day: string; month: string; year: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const colors = theme();
  const opacity = useSharedValue(0);
  const [checkIns, setCheckIns] = useState<CheckInType[]>([]);
  const [gradientHeight, setGradientHeight] = useState(0);
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const [gradientLocations, setGradientLocations] = useState<number[]>([]);
  const [bgVisible, setBgVisible] = useState(false);
  const iso = `${params.year}-${params.month.padStart(2, "0")}-${params.day.padStart(2, "0")}`;
  const date = new Date(iso);
  const title = date.toDateString();
  const itemHeight = Device.deviceType !== 1 ? 448 : 320;
  const edges = Device.deviceType !== 1 ? 24 : 16;

  const getCheckInData = async () => {
    try {
      // Get check-ins on this date (date column converted to local)
      const rows: CheckInType[] = await db.getAllAsync(
        `SELECT * FROM check_ins WHERE DATE(datetime(date, 'localtime')) = ? ORDER BY id DESC`,
        [iso]
      );

      setGradientHeight(rows.length * itemHeight + headerHeight + edges);
      const checkInColors = [];

      // Get check in colors
      for (let i = 0; i < rows.length; i++) {
        let mood: CheckInMoodType = JSON.parse(rows[i].mood);
        let data = MoodsData.filter((item) => item.id === mood.color);
        checkInColors.push(data[0].color);
      }

      setGradientColors(checkInColors);
      const stops = checkInColors.map((_, index) => index / checkInColors.length); // Calculate even color stops
      setGradientLocations(stops);
      setCheckIns(rows);

      // Fade in
      opacity.value = withTiming(
        1,
        {
          duration: 500,
          easing: Easing.in(Easing.cubic),
        },
        (isFinished) => {
          if (isFinished) runOnJS(setBgVisible)(true); // Background to avoid white/black space on elastic scroll
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCheckInData();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: title,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTransparent: true,
          headerTitleStyle: {
            fontFamily: "Tiempos-Bold",
          },
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => router.dismissAll()}
              label="Back"
              labelStyle={{ fontFamily: "Circular-Book", fontSize: Device.deviceType !== 1 ? 20 : 16 }}
              tintColor={colors.primary}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
        }}
      />

      {bgVisible && gradientColors.length ? (
        <View style={[styles.container]}>
          <View style={{ backgroundColor: gradientColors[0], height: gradientColors.length > 1 ? "50%" : "100%" }} />

          <View
            style={{
              backgroundColor: gradientColors[gradientColors.length - 1],
              height: "50%",
              display: gradientColors.length > 1 ? "flex" : "none",
            }}
          />

          <BlurView intensity={50} tint={colors.primary === "white" ? "dark" : "light"} style={styles.container} />
        </View>
      ) : (
        <></>
      )}

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ minHeight: "100%" }}>
        <Animated.View
          style={{
            opacity,
            flex: 1,
            backgroundColor: gradientColors.length ? gradientColors[gradientColors.length - 1] : "transparent",
          }}
        >
          <View style={[styles.container, { height: gradientHeight }]}>
            <View style={{ height: headerHeight, backgroundColor: gradientColors[0] }} />

            {gradientColors.length > 1 && gradientColors.length === gradientLocations.length && (
              <LinearGradient colors={gradientColors} locations={gradientLocations} style={{ flex: 1 }} />
            )}
          </View>

          {gradientColors.length ? (
            <BlurView intensity={50} tint={colors.primary === "white" ? "dark" : "light"} style={styles.container} />
          ) : (
            <></>
          )}

          <View
            style={{
              marginTop: headerHeight,
              paddingBottom: edges + insets.bottom,
            }}
          >
            {checkIns.map((item, index) => (
              <CheckIn key={index} data={item} itemHeight={itemHeight} getCheckInData={getCheckInData} />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <BlurView
        intensity={50}
        tint={colors.primary === "white" ? "dark" : "light"}
        style={[styles.container, { height: headerHeight }]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});

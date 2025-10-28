import React, { useEffect, useState } from "react";
import { ScrollView, useColorScheme, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Device from "expo-device";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { useSQLiteContext } from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import MoodsData from "data/moods.json";
import CheckIn from "components/day/CheckIn";
import { CheckInType, CheckInMoodType } from "types";
import { getTheme } from "utils/helpers";

export default function Day() {
  const params = useLocalSearchParams<{ day: string; month: string; year: string }>();
  const db = useSQLiteContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const [checkIns, setCheckIns] = useState<CheckInType[]>([]);
  const [gradientHeight, setGradientHeight] = useState(0);
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const [gradientLocations, setGradientLocations] = useState<number[]>([]);
  const iso = `${params.year}-${params.month.padStart(2, "0")}-${params.day.padStart(2, "0")}`;
  const date = new Date(iso);
  const title = date.toDateString();
  const itemHeight = Device.deviceType === 1 ? 384 : 448;

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const getCheckIns = async () => {
    try {
      // Get check-ins on this date (date column converted to local)
      const rows: CheckInType[] = await db.getAllAsync(
        `SELECT * FROM check_ins WHERE DATE(datetime(date, 'localtime')) = ? ORDER BY id DESC`,
        [iso]
      );

      setGradientHeight(rows.length * itemHeight + theme.spacing.base * (rows.length - 1)); // Gradient height needs to be fixed
      const checkInColors = [];

      // Get check-in colors from check-ins
      for (const row of rows) {
        const mood: CheckInMoodType = JSON.parse(row.mood);
        const data = MoodsData.filter((item) => item.id === mood.color);
        checkInColors.push(data[0].color);
      }

      setGradientColors(checkInColors);
      const stops = checkInColors.map((_, index) => index / checkInColors.length); // Calculate even color stops
      setGradientLocations(stops);
      setCheckIns(rows);
      opacity.value = withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) }); // Fade in
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCheckIns();
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
              labelStyle={{ fontFamily: "Circular-Book", fontSize: theme.fontSize.body }}
              tintColor={theme.color.primary}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
        }}
      />

      <ScrollView>
        <Animated.View
          style={[
            animatedStyles,
            {
              minHeight: "100%",
              backgroundColor: gradientColors.length === 1 ? gradientColors[0] : "transparent",
            },
          ]}
        >
          {/* Gradient background */}
          <View style={{ position: "absolute", width: "100%" }}>
            <View style={{ height: headerHeight + theme.spacing.base, backgroundColor: gradientColors[0] }} />

            {gradientColors.length > 1 && gradientColors.length === gradientLocations.length && (
              <LinearGradient
                colors={gradientColors as [string, string, ...string[]]}
                locations={gradientLocations as [number, number, ...number[]]}
                style={{ flex: 1, height: gradientHeight }}
              />
            )}
          </View>

          {/* Check-ins */}
          <View
            style={{
              marginTop: headerHeight,
              padding: theme.spacing.base,
              paddingBottom: 0,
              gap: theme.spacing.base,
            }}
          >
            {checkIns.map((item) => (
              <CheckIn key={item.id} data={item} itemHeight={itemHeight} getCheckIns={getCheckIns} />
            ))}
          </View>

          {/* End of gradient fill */}
          <View
            style={{
              backgroundColor: gradientColors.length ? gradientColors[gradientColors.length - 1] : "transparent",
              flex: 1,
              paddingBottom: theme.spacing.base + insets.bottom,
            }}
          />
        </Animated.View>
      </ScrollView>

      {/* Header background */}
      {checkIns.length ? (
        <BlurView
          intensity={50}
          tint={colorScheme as "light" | "dark"}
          style={{
            height: headerHeight,
            position: "absolute",
            width: "100%",
          }}
        />
      ) : null}

      <StatusBar style="light" translucent={false} backgroundColor="black" />
    </>
  );
}

import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Device from "expo-device";
import { BlurView } from "expo-blur";
import { useSQLiteContext } from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { CheckInType, CheckInMoodType } from "data/database";
import MoodsData from "data/moods.json";
import CheckIn from "components/day/CheckIn";
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
  const [gradientColors, setGradientColors] = useState([""]);
  const [gradientLocations, setGradientLocations] = useState([0]);
  const iso = `${params.year}-${params.month}-${params.day}`;
  const date = new Date(iso);
  const title = date.toDateString();
  const itemHeight = Device.deviceType !== 1 ? 320 : 256;
  const edges = Device.deviceType !== 1 ? 24 : 16;

  const getData = async () => {
    try {
      // Get check-ins on this date (date column converted to local)
      const query = `
      SELECT * FROM check_ins
      WHERE DATE(datetime(date, 'localtime')) = ? ORDER BY id DESC
    `;

      const rows: CheckInType[] | null = await db.getAllAsync(query, [iso]);
      setGradientHeight(rows.length * itemHeight + headerHeight + edges);
      const checkInColors = [];

      // Get check in colors
      for (let i = 0; i < rows.length; i++) {
        let mood: CheckInMoodType = JSON.parse(rows[i].mood);
        let data = MoodsData.filter((item) => item.id === mood.color);
        checkInColors.push(data[0].color);
      }

      const stops = checkInColors.map((_, index) => index / checkInColors.length); // Calculate even color stops
      setGradientColors(checkInColors);
      setGradientLocations(stops);
      setCheckIns(rows);
      opacity.value = withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) }); // Fade in
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
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
            fontFamily: "Circular-Book",
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

      <ScrollView contentContainerStyle={{ minHeight: "100%" }}>
        <Animated.View style={{ opacity, flex: 1, backgroundColor: gradientColors[gradientColors.length - 1] }}>
          <View style={[styles.container, { height: gradientHeight }]}>
            <View style={{ height: headerHeight, backgroundColor: gradientColors[0] }} />

            {gradientColors.length > 1 && gradientColors.length === gradientLocations.length && (
              <LinearGradient colors={gradientColors} locations={gradientLocations} style={{ flex: 1 }} />
            )}
          </View>

          <BlurView intensity={50} tint={colors.primary === "white" ? "dark" : "light"} style={styles.blur} />

          <View
            style={{
              marginTop: headerHeight,
              paddingBottom: edges + insets.bottom,
            }}
          >
            {checkIns.map((item, index) => (
              <CheckIn key={index} data={item} itemHeight={itemHeight} getData={getData} />
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
    position: "absolute",
  },
  blur: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});

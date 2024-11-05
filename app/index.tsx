import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Settings, CalendarIcon, Share } from "lucide-react-native";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import BigButton from "components/BigButton";
import Calendar from "components/home/Calendar";
import { pressedDefault, theme, convertToISO } from "utils/helpers";

export default function Home() {
  const insets = useSafeAreaInsets();
  const colors = theme();
  const router = useRouter();
  const db = useSQLiteContext();
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const [rangeText, setRangeText] = useState("");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const verifyCheckIn = async () => {
    // Redirect if user hasn't checked-in today
    try {
      const today = new Date();

      // Check for check-in today (date column converted to local)
      const query = `
    SELECT * FROM check_ins
    WHERE DATE(datetime(date, 'localtime')) = ?
  `;

      const row = await db.getFirstAsync(query, [convertToISO(today)]);
      if (!row) router.push("check-in"); // Redirect
    } catch (error) {
      console.log(error);
    }

    SplashScreen.hideAsync();
  };

  useEffect(() => {
    if (homeDates) {
      const today = new Date();
      const year = today.getFullYear();

      const start = `${months[homeDates.weekStart.getMonth()]} ${homeDates.weekStart.getDate()}${
        homeDates.weekStart.getFullYear() !== year ? ` ${homeDates.weekStart.getFullYear()}` : ""
      }`;

      const endDate = new Date(homeDates.weekStart);
      endDate.setDate(homeDates.weekStart.getDate() + 6); // Sunday

      const end = `${months[endDate.getMonth()]} ${endDate.getDate()}${
        endDate.getFullYear() !== year ? ` ${endDate.getFullYear()}` : ""
      }`;

      setRangeText(`${start} - ${end}`);
    }
  }, [homeDates]);

  useEffect(() => {
    verifyCheckIn();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerLeft: () => (
            <Pressable
              onPress={() => router.push("date-filters")}
              style={({ pressed }) => [styles.headerLeft, pressedDefault(pressed)]}
              hitSlop={16}
            >
              <CalendarIcon
                color={colors.primary}
                size={Device.deviceType !== 1 ? 32 : 24}
                absoluteStrokeWidth
                strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
              />

              <Text
                style={[
                  styles.headerText,
                  {
                    fontSize: Device.deviceType !== 1 ? 20 : 16,
                    color: colors.primary,
                  },
                ]}
                allowFontScaling={false}
              >
                {rangeText}
              </Text>
            </Pressable>
          ),
          headerRight: () => (
            <View style={[styles.headerRight, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
              <Pressable
                onPress={() => alert("Coming soon")}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={8}
              >
                <Share
                  color={colors.primary}
                  size={Device.deviceType !== 1 ? 36 : 28}
                  absoluteStrokeWidth
                  strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
                />
              </Pressable>

              <Pressable
                onPress={() => alert("Coming soon")}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={8}
              >
                <Settings
                  color={colors.primary}
                  size={Device.deviceType !== 1 ? 36 : 28}
                  absoluteStrokeWidth
                  strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
                />
              </Pressable>
            </View>
          ),
        }}
      />

      <Calendar />

      <View style={{ padding: 24 }}>
        <Text style={{ textAlign: "center", color: colors.secondary, fontSize: 16 }}>
          This screen will display AI insights from selected mood check-in dates, as well as original content from
          MOOD.ai and company resources.
        </Text>
      </View>

      <View
        style={[
          styles.footer,
          {
            padding: Device.deviceType !== 1 ? 24 : 16,
            paddingBottom: Device.deviceType !== 1 ? 24 + insets.bottom : 16 + insets.bottom,
          },
        ]}
      >
        <BigButton text="Check-in" route="check-in" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontFamily: "Circular-Book",
  },
  headerRight: {
    flexDirection: "row",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
});

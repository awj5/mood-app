import { useEffect } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Settings, Share } from "lucide-react-native";
import BigButton from "components/BigButton";
import Calendar from "components/home/Calendar";
import HeaderLeft from "components/home/HeaderLeft";
import { pressedDefault, theme, convertToISO } from "utils/helpers";

export default function Home() {
  const insets = useSafeAreaInsets();
  const colors = theme();
  const router = useRouter();
  const db = useSQLiteContext();

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
    verifyCheckIn();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerLeft: () => <HeaderLeft />,
          headerRight: () => (
            <View style={[styles.headerRight, { gap: Device.deviceType !== 1 ? 24 : 20 }]}>
              <Pressable
                onPress={() => alert("Coming soon")}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={8}
              >
                <Share
                  color={colors.primary}
                  size={Device.deviceType !== 1 ? 32 : 24}
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
                  size={Device.deviceType !== 1 ? 32 : 24}
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
        <BigButton route="check-in">Check-in</BigButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

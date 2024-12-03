import { useEffect } from "react";
import { View, Pressable } from "react-native";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import { useHeaderHeight } from "@react-navigation/elements";
import { Settings, Download } from "lucide-react-native";
import Calendar from "components/home/Calendar";
import HeaderLeft from "components/home/HeaderLeft";
import Bg from "components/home/Bg";
import Footer from "components/home/Footer";
import Content from "components/home/Content";
import { pressedDefault, theme, convertToISO } from "utils/helpers";

export default function Home() {
  const headerHeight = useHeaderHeight();
  const colors = theme();
  const router = useRouter();
  const db = useSQLiteContext();
  const iconSize = Device.deviceType !== 1 ? 32 : 24;
  const iconStroke = Device.deviceType !== 1 ? 2.5 : 2;

  const verifyCheckIn = async () => {
    // Redirect if user hasn't checked-in today
    try {
      const today = new Date();

      // Check for check-in today (date column converted to local)
      const row = await db.getFirstAsync(`SELECT id FROM check_ins WHERE DATE(datetime(date, 'localtime')) = ?`, [
        convertToISO(today),
      ]);

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
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTransparent: true,
          headerLeft: () => <HeaderLeft />,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: Device.deviceType !== 1 ? 24 : 20 }}>
              <Pressable
                onPress={() => alert("Coming soon")}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={8}
              >
                <Download color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={iconStroke} />
              </Pressable>

              <Pressable
                onPress={() => alert("Coming soon")}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={8}
              >
                <Settings color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={iconStroke} />
              </Pressable>
            </View>
          ),
        }}
      />

      <Bg />

      <View style={{ flex: 1, marginTop: headerHeight }}>
        <Calendar />
        <Content />
      </View>

      <Footer />
    </View>
  );
}

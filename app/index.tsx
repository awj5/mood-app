import { useState, useRef, useCallback } from "react";
import { View, Pressable } from "react-native";
import { SplashScreen, Stack, useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import { useHeaderHeight } from "@react-navigation/elements";
import { Settings, Download } from "lucide-react-native";
import Calendar from "components/home/Calendar";
import HeaderLeft from "components/home/HeaderLeft";
import Bg from "components/home/Bg";
import Footer from "components/home/Footer";
import Content from "components/home/Content";
import NotiPrompt from "components/home/NotiPrompt";
import { pressedDefault, theme, convertToISO } from "utils/helpers";

export default function Home() {
  const headerHeight = useHeaderHeight();
  const colors = theme();
  const router = useRouter();
  const db = useSQLiteContext();
  const todayRef = useRef<Date>();
  const notiPromptSeenRef = useRef(false);
  const [notiPromptVisible, setNotiPromptVisible] = useState(false);
  const iconSize = Device.deviceType !== 1 ? 32 : 24;
  const iconStroke = Device.deviceType !== 1 ? 2.5 : 2;

  const checkNotifications = () => {
    setNotiPromptVisible(true);
    notiPromptSeenRef.current = true;
  };

  const verifyCheckInData = async () => {
    todayRef.current = new Date();

    // Redirect if user hasn't checked-in today
    try {
      // Check for check-in today (date column converted to local)
      const row = await db.getFirstAsync(`SELECT id FROM check_ins WHERE DATE(datetime(date, 'localtime')) = ?`, [
        convertToISO(todayRef.current),
      ]);

      if (!row) {
        router.push("check-in"); // Redirect
      } else {
        checkNotifications();
      }
    } catch (error) {
      console.log(error);
    }

    SplashScreen.hideAsync();
  };

  useFocusEffect(
    useCallback(() => {
      if (!todayRef.current) {
        verifyCheckInData(); // Redirect if no check-in today
      } else if (!notiPromptSeenRef.current) {
        checkNotifications();
      }
    }, [])
  );

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

      <NotiPrompt visible={notiPromptVisible} setVisible={setNotiPromptVisible} />
      <Bg />

      <View style={{ flex: 1, marginTop: headerHeight }}>
        <Calendar />
        <Content />
      </View>

      <Footer />
    </View>
  );
}

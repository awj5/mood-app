import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CircleCheck } from "lucide-react-native";
import BigButton from "components/BigButton";
import { convertToISO } from "utils/helpers";

export default function Footer() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const appState = useRef(AppState.currentState);
  const [bounce, setBounce] = useState(false);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const checkBounce = async () => {
    // Bounce check-in button if user hasn't checked-in today
    try {
      const today = new Date();

      // Check for check-in today (date column converted to local)
      const row = await db.getFirstAsync(`SELECT id FROM check_ins WHERE DATE(datetime(date, 'localtime')) = ?`, [
        convertToISO(today),
      ]);

      setBounce(!row ? true : false);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (appStateVisible === "active") {
        checkBounce();
      }
    }, [appStateVisible])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: Device.deviceType !== 1 ? 24 : 16,
          marginBottom: Device.deviceType !== 1 ? 24 + insets.bottom : 16 + insets.bottom,
        },
      ]}
    >
      <BigButton route="check-in" shadow bounce={bounce} icon={CircleCheck}>
        Check-in
      </BigButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    maxWidth: 448 + 48,
    alignSelf: "center",
  },
});

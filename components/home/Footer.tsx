import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CircleCheck } from "lucide-react-native";
import BigButton from "components/BigButton";
import { convertToISO } from "utils/dates";

type FooterProps = {
  noCheckInToday: boolean;
  setNoCheckInToday: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Footer(props: FooterProps) {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const checkBounce = async () => {
    // Bounce check-in button if user hasn't checked-in today
    try {
      const today = new Date();

      // Check for check-in today (date column converted to local)
      const row = await db.getFirstAsync(`SELECT id FROM check_ins WHERE DATE(datetime(date, 'localtime')) = ?`, [
        convertToISO(today),
      ]);

      props.setNoCheckInToday(!row ? true : false);
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
          paddingHorizontal: Device.deviceType !== 1 ? 48 : 32,
          marginBottom: Device.deviceType !== 1 ? 24 + insets.bottom : 16 + insets.bottom,
        },
      ]}
    >
      <BigButton route="check-in" shadow bounce={props.noCheckInToday} icon={CircleCheck}>
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
    maxWidth: 768,
    alignSelf: "center",
  },
});

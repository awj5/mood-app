import { useEffect } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import BigButton from "components/BigButton";
import { CheckInType, CheckInMoodType } from "data/database";

export default function Home() {
  const db = useSQLiteContext();

  const getCheckIns = async () => {
    try {
      const firstRow: CheckInType | null = await db.getFirstAsync("SELECT * FROM check_ins");
      const mood: CheckInMoodType = JSON.parse(firstRow!.mood);
      console.log(mood.color);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCheckIns();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { padding: Device.deviceType !== 1 ? 24 : 16 }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <BigButton text="Check-in" route="check-in" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

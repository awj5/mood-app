import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, ScrollView, Text } from "react-native";
import { Stack } from "expo-router";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Settings, CalendarIcon } from "lucide-react-native";
import BigButton from "components/BigButton";
import Calendar from "components/home/Calendar";
import { pressedDefault, theme } from "utils/helpers";

export type CalendarDatesType = {
  weekStart: Date;
  rangeStart?: Date;
  rangeEnd?: Date;
};

export default function Home() {
  const insets = useSafeAreaInsets();
  const colors = theme();
  const [calendarDates, setCalendarDates] = useState<CalendarDatesType>();
  const [rangeText, setRangeText] = useState("");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    if (calendarDates) {
      const today = new Date();
      const year = today.getFullYear();

      const start = `${months[calendarDates.weekStart.getMonth()]} ${calendarDates.weekStart.getDate()}${
        calendarDates.weekStart.getFullYear() !== year ? ` ${calendarDates.weekStart.getFullYear()}` : ""
      }`;

      const endDate = new Date(calendarDates.weekStart);
      endDate.setDate(calendarDates.weekStart.getDate() + 6); // Sunday

      const end = `${months[endDate.getMonth()]} ${endDate.getDate()}${
        endDate.getFullYear() !== year ? ` ${endDate.getFullYear()}` : ""
      }`;

      setRangeText(`${start} - ${end}`);
    }
  }, [calendarDates]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerLeft: () => (
            <Pressable
              onPress={() => null}
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
                    fontSize: Device.deviceType !== 1 ? 24 : 18,
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
            <Pressable onPress={() => null} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
              <Settings
                color={colors.primary}
                size={Device.deviceType !== 1 ? 36 : 28}
                absoluteStrokeWidth
                strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
              />
            </Pressable>
          ),
        }}
      />

      <Calendar calendarDates={calendarDates} setCalendarDates={setCalendarDates} />
      <ScrollView></ScrollView>

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
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
});

import { useContext, useEffect, useState } from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import { CalendarDays, CalendarRange } from "lucide-react-native";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import { pressedDefault, theme } from "utils/helpers";

export default function HeaderLeft() {
  const router = useRouter();
  const colors = theme();
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const [rangeText, setRangeText] = useState("");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    if (homeDates) {
      const today = new Date();
      const year = today.getFullYear();
      const startDate = homeDates.rangeStart ? homeDates.rangeStart : homeDates.weekStart;

      const start = `${months[startDate.getMonth()]} ${startDate.getDate()}${
        startDate.getFullYear() !== year ? ` ${startDate.getFullYear()}` : ""
      }`;

      var endDate = new Date(startDate);

      if (homeDates.rangeEnd) {
        endDate = homeDates.rangeEnd;
      } else {
        endDate.setDate(homeDates.weekStart.getDate() + 6); // Sunday
      }

      const end = `${months[endDate.getMonth()]} ${endDate.getDate()}${
        endDate.getFullYear() !== year ? ` ${endDate.getFullYear()}` : ""
      }`;

      setRangeText(`${start} - ${end}`);
    }
  }, [homeDates]);

  return (
    <Pressable
      onPress={() => router.push("date-filters")}
      style={({ pressed }) => [styles.container, pressedDefault(pressed), { gap: Device.deviceType !== 1 ? 8 : 6 }]}
      hitSlop={16}
    >
      {homeDates?.rangeStart ? (
        <CalendarRange
          color={colors.primary}
          size={Device.deviceType !== 1 ? 36 : 28}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
        />
      ) : (
        <CalendarDays
          color={colors.primary}
          size={Device.deviceType !== 1 ? 36 : 28}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
        />
      )}

      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: homeDates?.rangeStart ? colors.primary : "transparent",
            paddingVertical: !homeDates?.rangeStart ? 0 : Device.deviceType !== 1 ? 6 : 4,
            paddingHorizontal: !homeDates?.rangeStart ? 0 : Device.deviceType !== 1 ? 16 : 12,
          },
        ]}
      >
        <Text
          style={{
            fontFamily: homeDates?.rangeStart ? "Circular-Bold" : "Circular-Book",
            fontSize: Device.deviceType !== 1 ? (homeDates?.rangeStart ? 20 : 24) : homeDates?.rangeStart ? 16 : 18,
            color: !homeDates?.rangeStart ? colors.primary : colors.primary === "white" ? "black" : "white",
          }}
          allowFontScaling={false}
        >
          {rangeText}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  wrapper: {
    borderRadius: 999,
  },
});

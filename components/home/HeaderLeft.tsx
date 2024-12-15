import { useContext, useEffect, useState } from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import { CalendarDays, CalendarRange } from "lucide-react-native";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import { pressedDefault, theme, getDateRange } from "utils/helpers";

export default function HeaderLeft() {
  const router = useRouter();
  const colors = theme();
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const [rangeText, setRangeText] = useState("");
  const stroke = Device.deviceType !== 1 ? 2.5 : 2;
  const iconSize = Device.deviceType !== 1 ? 32 : 24;

  useEffect(() => {
    setRangeText(getDateRange(homeDates));
  }, [homeDates]);

  return (
    <Pressable
      onPress={() => router.push("date-filters")}
      style={({ pressed }) => [styles.container, pressedDefault(pressed), { gap: Device.deviceType !== 1 ? 12 : 8 }]}
      hitSlop={16}
    >
      {homeDates.rangeStart ? (
        <CalendarRange color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={stroke} />
      ) : (
        <CalendarDays color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={stroke} />
      )}

      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: homeDates.rangeStart ? colors.primary : "transparent",
            height: Device.deviceType !== 1 ? 36 : 28,
            paddingHorizontal: !homeDates.rangeStart ? 0 : Device.deviceType !== 1 ? 16 : 12,
          },
        ]}
      >
        <Text
          style={{
            fontFamily: homeDates.rangeStart ? "Circular-Bold" : "Circular-Book",
            fontSize: Device.deviceType !== 1 ? 24 : 18,
            color: !homeDates.rangeStart ? colors.primary : colors.primary === "white" ? "black" : "white",
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
    justifyContent: "center",
  },
});

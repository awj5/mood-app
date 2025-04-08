import { useEffect, useState } from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import { CalendarDays, CalendarRange } from "lucide-react-native";
import { CalendarDatesType } from "context/home-dates";
import { pressedDefault, theme } from "utils/helpers";
import { getDateRange } from "utils/dates";

type HeaderDatesProps = {
  dates: CalendarDatesType;
  type: string;
  hidden?: boolean;
};

export default function HeaderDates(props: HeaderDatesProps) {
  const router = useRouter();
  const colors = theme();
  const [rangeText, setRangeText] = useState("");
  const stroke = Device.deviceType !== 1 ? 2.5 : 2;
  const iconSize = Device.deviceType !== 1 ? 32 : 24;

  useEffect(() => {
    setRangeText(getDateRange(props.dates));
  }, [props.dates]);

  return (
    <Pressable
      onPress={() => router.push({ pathname: "date-filters", params: { type: props.type } })}
      style={({ pressed }) => [
        styles.container,
        pressedDefault(pressed),
        { gap: Device.deviceType !== 1 ? 12 : 8, display: props.hidden ? "none" : "flex" },
      ]}
      hitSlop={16}
      disabled={props.hidden}
    >
      {props.dates.rangeStart || props.type === "company" ? (
        <CalendarRange color={colors.link} size={iconSize} absoluteStrokeWidth strokeWidth={stroke} />
      ) : (
        <CalendarDays color={colors.link} size={iconSize} absoluteStrokeWidth strokeWidth={stroke} />
      )}

      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: props.dates.rangeStart && props.type === "home" ? colors.link : "transparent",
            height: Device.deviceType !== 1 ? 36 : 28,
            paddingHorizontal: !props.dates.rangeStart || props.type !== "home" ? 0 : Device.deviceType !== 1 ? 16 : 12,
          },
        ]}
      >
        <Text
          style={{
            fontFamily: "Circular-Book",
            fontSize: Device.deviceType !== 1 ? 24 : 18,
            color:
              !props.dates.rangeStart || props.type !== "home"
                ? colors.link
                : colors.primary === "white"
                ? "black"
                : "white",
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

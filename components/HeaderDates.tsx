import { useEffect, useState } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import { CalendarDays, CalendarRange } from "lucide-react-native";
import { CalendarDatesType } from "types";
import { getTheme, pressedDefault } from "utils/helpers";
import { getDateRange } from "utils/dates";

type HeaderDatesProps = {
  dates: CalendarDatesType;
  type: string; // home or company
};

export default function HeaderDates(props: HeaderDatesProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [rangeText, setRangeText] = useState("");

  useEffect(() => {
    setRangeText(getDateRange(props.dates));
  }, [props.dates]);

  return (
    <Pressable
      onPress={() => router.push({ pathname: "date-filters", params: { type: props.type } })}
      style={({ pressed }) => [
        pressedDefault(pressed),
        { gap: theme.spacing.small / 2, flexDirection: "row", alignItems: "center" },
      ]}
      hitSlop={16}
    >
      {props.dates.rangeStart ? (
        <CalendarRange
          color={theme.color.link}
          size={theme.icon.large.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.large.stroke}
        />
      ) : (
        <CalendarDays
          color={theme.color.link}
          size={theme.icon.large.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.large.stroke}
        />
      )}

      <View
        style={{
          backgroundColor: props.dates.rangeStart ? theme.color.link : "transparent",
          paddingHorizontal: props.dates.rangeStart ? theme.spacing.small : 0,
          height: Device.deviceType === 1 ? 32 : 40,
          justifyContent: "center",
          borderRadius: 999,
        }}
      >
        <Text
          style={{
            fontFamily: "Tiempos-Bold",
            fontSize: theme.fontSize.large,
            color: !props.dates.rangeStart ? theme.color.link : theme.color.inverted,
          }}
          allowFontScaling={false}
        >
          {rangeText}
        </Text>
      </View>
    </Pressable>
  );
}

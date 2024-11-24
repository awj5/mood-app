import { View, Text } from "react-native";
import * as Device from "expo-device";
import { CalendarX2 } from "lucide-react-native";
import { theme } from "utils/helpers";

export default function NoCheckIns() {
  const colors = theme();

  return (
    <View style={{ alignItems: "center", gap: Device.deviceType !== 1 ? 12 : 8 }}>
      <CalendarX2
        color={colors.primary}
        size={Device.deviceType !== 1 ? 64 : 48}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 4 : 3}
      />

      <Text
        style={{
          color: colors.primary,
          fontFamily: "Circular-Book",
          fontSize: Device.deviceType !== 1 ? 20 : 16,
        }}
        allowFontScaling={false}
      >
        No check-ins found
      </Text>
    </View>
  );
}

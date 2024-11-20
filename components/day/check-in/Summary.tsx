import { View, Text } from "react-native";
import * as Device from "expo-device";
import { theme } from "utils/helpers";

type SummaryProps = {
  text: string;
};

export default function Summary(props: SummaryProps) {
  const colors = theme();

  return (
    <View style={{ gap: Device.deviceType !== 1 ? 6 : 4, paddingHorizontal: Device.deviceType !== 1 ? 24 : 16 }}>
      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: colors.primary,
          fontSize: Device.deviceType !== 1 ? 18 : 14,
        }}
        allowFontScaling={false}
      >
        SUMMARY
      </Text>

      <Text
        style={{
          fontFamily: "Circular-Book",
          color: props.text ? colors.primary : colors.primary === "white" ? "#999999" : "#666666",
          fontSize: Device.deviceType !== 1 ? 20 : 16,
        }}
        allowFontScaling={false}
      >
        {props.text ? props.text : "Not found"}
      </Text>
    </View>
  );
}

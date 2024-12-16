import { View, Text } from "react-native";
import * as Device from "expo-device";
import { useHeaderHeight } from "@react-navigation/elements";
import { theme } from "utils/helpers";

type HeaderTitleProps = {
  text: string;
  description?: string;
  transparentHeader?: boolean;
};

export default function HeaderTitle(props: HeaderTitleProps) {
  const colors = theme();
  const headerHeight = useHeaderHeight();

  return (
    <View
      style={{
        paddingHorizontal: Device.deviceType !== 1 ? 24 : 16,
        paddingVertical: Device.deviceType !== 1 ? 12 : 8,
        gap: Device.deviceType !== 1 ? 8 : 4,
        marginTop: props.transparentHeader ? headerHeight : 0,
      }}
    >
      <Text
        style={{ fontFamily: "Circular-Bold", fontSize: Device.deviceType !== 1 ? 48 : 36, color: colors.primary }}
        allowFontScaling={false}
      >
        {props.text}
      </Text>

      {props.description && (
        <Text
          style={{ fontFamily: "Circular-Book", color: colors.secondary, fontSize: Device.deviceType !== 1 ? 20 : 16 }}
          allowFontScaling={false}
        >
          {props.description}
        </Text>
      )}
    </View>
  );
}

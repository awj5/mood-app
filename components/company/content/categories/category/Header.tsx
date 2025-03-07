import { View, Text, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { theme } from "utils/helpers";

type HeaderProps = {
  title: string;
  icon: React.ElementType;
};

export default function Header(props: HeaderProps) {
  const colors = theme();
  const Icon = props.icon;
  const iconSize = Device.deviceType !== 1 ? 32 : 24;

  return (
    <View>
      <Text
        style={[
          styles.text,
          {
            fontSize: Device.deviceType !== 1 ? 16 : 12,
            color: colors.primary,
            paddingRight: iconSize,
          },
        ]}
        allowFontScaling={false}
      >
        {props.title}
      </Text>

      <Icon
        color={colors.primary}
        size={iconSize}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
        style={[styles.icon, { margin: Device.deviceType !== 1 ? -2.5 : -2 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Circular-Medium",
    textTransform: "uppercase",
  },
  icon: {
    position: "absolute",
    right: 0,
  },
});

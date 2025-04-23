import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import { Check } from "lucide-react-native";
import { theme } from "utils/helpers";

type ItemProps = {
  children: string;
};

export default function Item(props: ItemProps) {
  const colors = theme();

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 10 : 6 }]}>
      <Check
        color={colors.primary}
        size={Device.deviceType !== 1 ? 28 : 20}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
      />

      <Text
        style={[
          styles.text,
          {
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 20 : 16,
          },
        ]}
        allowFontScaling={false}
      >
        {props.children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    flex: 1,
    fontFamily: "Circular-Medium",
  },
});

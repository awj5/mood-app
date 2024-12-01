import { View, StyleSheet, Text } from "react-native";
import * as Device from "expo-device";
import { theme } from "utils/helpers";

type MessageProps = {
  text: string;
};

export default function Message(props: MessageProps) {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  return (
    <View
      style={[
        styles.container,
        {
          margin: spacing,
          paddingHorizontal: spacing,
          paddingVertical: Device.deviceType !== 1 ? 16 : 12,
          backgroundColor: colors.secondaryBg,
          borderRadius: Device.deviceType !== 1 ? 28 : 24,
        },
      ]}
    >
      <Text
        style={{
          fontFamily: "Circular-Book",
          color: colors.primary,
          fontSize: Device.deviceType !== 1 ? 20 : 16,
        }}
      >
        {props.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    maxWidth: 512,
  },
});

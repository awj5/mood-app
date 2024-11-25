import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import * as Device from "expo-device";
import { theme } from "utils/helpers";

type LoadingProps = {
  text: string;
};

export default function Loading(props: LoadingProps) {
  const colors = theme();

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 8 : 6 }]}>
      <ActivityIndicator color={colors.primary} />

      <Text
        style={{
          color: colors.primary,
          fontFamily: "Circular-Book",
          fontSize: Device.deviceType !== 1 ? 20 : 16,
        }}
        allowFontScaling={false}
      >
        {props.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});

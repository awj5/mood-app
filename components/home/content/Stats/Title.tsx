import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import { theme } from "utils/helpers";

type TitleProps = {
  children: string;
};

export default function Title(props: TitleProps) {
  const colors = theme();

  return (
    <View style={[styles.container, { height: Device.deviceType !== 1 ? 36 : 28 }]}>
      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: colors.primary,
          fontSize: Device.deviceType !== 1 ? 16 : 12,
        }}
        allowFontScaling={false}
      >
        {props.children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
});

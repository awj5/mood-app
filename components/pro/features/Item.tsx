import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";

type ItemProps = {
  children: string;
  icon: React.ElementType;
};

export default function Item(props: ItemProps) {
  const Icon = props.icon;

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 12 : 8 }]}>
      <Icon
        color="white"
        size={Device.deviceType !== 1 ? 28 : 20}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
      />

      <Text
        style={[
          styles.text,
          {
            fontSize: Device.deviceType !== 1 ? 20 : 16,
          },
        ]}
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
    fontFamily: "Circular-Book",
    color: "white",
  },
});

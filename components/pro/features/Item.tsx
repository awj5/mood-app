import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import { Check } from "lucide-react-native";

type ItemProps = {
  children: string;
};

export default function Item(props: ItemProps) {
  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 12 : 8 }]}>
      <Check
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

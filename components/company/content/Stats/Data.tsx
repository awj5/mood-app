import { StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";

type DataProps = {
  number: string;
  text: string;
};

export default function Data(props: DataProps) {
  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 6 : 4 }]}>
      <Text style={[styles.number, { fontSize: Device.deviceType !== 1 ? 20 : 16 }]} allowFontScaling={false}>
        {props.number}
      </Text>

      <Text style={[styles.text, { fontSize: Device.deviceType !== 1 ? 18 : 14 }]} allowFontScaling={false}>
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
  number: {
    fontFamily: "Circular-Bold",
    color: "white",
  },
  text: {
    fontFamily: "Circular-Book",
    color: "white",
  },
});

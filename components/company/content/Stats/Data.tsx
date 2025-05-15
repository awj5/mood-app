import { StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";

type DataProps = {
  number: string;
  text: string;
};

export default function Data(props: DataProps) {
  const fontSize = Device.deviceType !== 1 ? 18 : 14;

  return (
    <View style={{ flexDirection: "row", alignItems: "baseline" }}>
      <Text
        style={[styles.number, { fontSize: /\d/.test(props.number) ? fontSize : Device.deviceType !== 1 ? 16 : 12 }]}
        allowFontScaling={false}
      >
        {props.number}
      </Text>

      <Text style={[styles.text, { fontSize: fontSize }]} allowFontScaling={false}>
        {` ${props.text}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  number: {
    fontFamily: "Circular-Bold",
    color: "black",
  },
  text: {
    fontFamily: "Circular-Book",
    color: "black",
  },
});

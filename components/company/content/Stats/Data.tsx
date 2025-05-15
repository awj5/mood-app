import { StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";
import { Users } from "lucide-react-native";

type DataProps = {
  number: string;
  text: string;
  userView?: boolean;
};

export default function Data(props: DataProps) {
  const fontSize = Device.deviceType !== 1 ? 18 : 14;

  return (
    <View style={[styles.conatiner, { gap: Device.deviceType !== 1 ? 10 : 6 }]}>
      {props.userView && (
        <Users
          color="black"
          size={Device.deviceType !== 1 ? 20 : 16}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 1.5 : 1}
        />
      )}

      <View style={styles.wrapper}>
        <Text
          style={[styles.number, { fontSize: !props.userView ? fontSize : Device.deviceType !== 1 ? 16 : 12 }]}
          allowFontScaling={false}
        >
          {props.number}
        </Text>

        <Text style={[styles.text, { fontSize: fontSize }]} allowFontScaling={false}>
          {` ${props.text}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: "row",
    alignItems: "center",
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  number: {
    fontFamily: "Circular-Bold",
    color: "black",
  },
  text: {
    fontFamily: "Circular-Book",
    color: "black",
  },
});

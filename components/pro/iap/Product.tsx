import { StyleSheet, View, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import { Circle, CircleCheck } from "lucide-react-native";
import { pressedDefault, theme } from "utils/helpers";

type ProductProps = {
  title: string;
  price: number;
  cycle: string;
  selected: boolean;
};

export default function Product(props: ProductProps) {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const stroke = Device.deviceType !== 1 ? 2 : 1.5;
  const invertedColor = colors.primary === "white" ? "black" : "white";
  const Icon = props.selected ? CircleCheck : Circle;

  return (
    <Pressable
      onPress={() => alert("Coming soon")}
      style={({ pressed }) => [
        pressedDefault(pressed),
        {
          flex: 1,
        },
      ]}
      hitSlop={8}
      disabled={props.selected}
    >
      <View
        style={[
          styles.wrapper,
          {
            borderWidth: Device.deviceType !== 1 ? 2.5 : 2,
            borderColor: invertedColor,
            borderRadius: spacing,
            padding: spacing,
            opacity: props.selected ? 1 : 0.5,
          },
        ]}
      >
        <View
          style={[
            styles.heading,
            { gap: Device.deviceType !== 1 ? 10 : 6, marginLeft: 0 - stroke, marginTop: 0 - stroke },
          ]}
        >
          <Icon
            color={invertedColor}
            size={Device.deviceType !== 1 ? 28 : 20}
            absoluteStrokeWidth
            strokeWidth={stroke}
          />

          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: invertedColor,
              fontSize: Device.deviceType !== 1 ? 16 : 12,
            }}
            allowFontScaling={false}
          >
            {props.title}
          </Text>
        </View>

        <View style={[styles.price, { gap: spacing / 4 }]}>
          <Text
            style={{
              fontFamily: "Circular-Medium",
              color: invertedColor,
              fontSize: Device.deviceType !== 1 ? 24 : 18,
            }}
            allowFontScaling={false}
          >
            ${props.price}
          </Text>

          <Text
            style={{
              fontFamily: "Circular-Book",
              color: invertedColor,
              fontSize: Device.deviceType !== 1 ? 18 : 14,
            }}
            allowFontScaling={false}
          >
            {`per ${props.cycle}`}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    flexDirection: "row",
    alignItems: "baseline",
  },
});

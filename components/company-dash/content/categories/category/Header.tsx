import { View, Text, StyleSheet } from "react-native";
import * as Device from "expo-device";
import moodsData from "data/moods.json";

type HeaderProps = {
  title: string;
  icon: React.ElementType;
};

export default function Header(props: HeaderProps) {
  const Icon = props.icon;
  const mood = moodsData[Math.floor(Math.random() * moodsData.length)]; // Random mood - will delete
  const textColor = mood.id >= 6 && mood.id <= 11 ? "white" : "black";

  return (
    <View
      style={[
        styles.container,
        {
          gap: Device.deviceType !== 1 ? 10 : 6,
          backgroundColor: mood.color,
          paddingVertical: Device.deviceType !== 1 ? 8 : 6,
          paddingHorizontal: Device.deviceType !== 1 ? 16 : 12,
        },
      ]}
    >
      <Icon
        color={textColor}
        size={Device.deviceType !== 1 ? 28 : 20}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
      />

      <Text
        style={{
          fontFamily: "Circular-Medium",
          fontSize: Device.deviceType !== 1 ? 20 : 16,
          color: textColor,
        }}
        allowFontScaling={false}
      >
        {props.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    borderRadius: 999,
  },
});

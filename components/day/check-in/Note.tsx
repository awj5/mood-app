import { StyleSheet, View, Text, ScrollView } from "react-native";
import * as Device from "expo-device";
import { Sparkles } from "lucide-react-native";
import { theme } from "utils/helpers";

type NoteProps = {
  text: string;
};

export default function Note(props: NoteProps) {
  const colors = theme();
  const gap = Device.deviceType !== 1 ? 6 : 4;

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: Device.deviceType !== 1 ? 24 : 16,
        gap: gap,
      }}
    >
      <View style={[styles.title, { gap: gap }]}>
        <Sparkles
          color={colors.primary}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
          style={{
            display: props.text && props.text.indexOf("[NOTE FROM USER]:") === -1 ? "flex" : "none",
          }}
        />

        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 18 : 14,
          }}
          allowFontScaling={false}
        >
          {props.text && props.text.indexOf("[NOTE FROM USER]:") !== -1 ? "NOTE" : "INSIGHTS"}
        </Text>
      </View>

      <ScrollView>
        <Text
          style={{
            fontFamily: "Circular-Book",
            color: colors.primary,
            opacity: props.text ? 1 : 0.5,
            fontSize: Device.deviceType !== 1 ? 20 : 16,
          }}
          allowFontScaling={false}
        >
          {props.text ? props.text : "Not included"}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
});

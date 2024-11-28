import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import * as Device from "expo-device";
import { Sparkles } from "lucide-react-native";
import { CheckInType } from "data/database";
import { theme } from "utils/helpers";

type NoteProps = {
  data: CheckInType;
};

export default function Note(props: NoteProps) {
  const colors = theme();
  const [text, setText] = useState<string>();
  const gap = Device.deviceType !== 1 ? 6 : 4;

  useEffect(() => {
    setText(props.data.note ? props.data.note : ""); // !!!!!! If no note, check if AI summary was saved locally
  }, []);

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
          style={{ display: props.data.note ? "none" : "flex" }}
        />

        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 18 : 14,
          }}
          allowFontScaling={false}
        >
          {props.data.note ? "NOTE" : "INSIGHTS"}
        </Text>
      </View>

      <ScrollView>
        <Text
          style={{
            fontFamily: "Circular-Book",
            color: colors.primary,
            opacity: text ? 1 : 0.5,
            fontSize: Device.deviceType !== 1 ? 20 : 16,
          }}
          allowFontScaling={false}
        >
          {text ? text : text !== undefined && "Not found"}
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

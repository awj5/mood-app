import { StyleSheet, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import axios from "axios";
import { Flag } from "lucide-react-native";
import { theme, pressedDefault } from "utils/helpers";
import { useState } from "react";

type ReportProps = {
  text: string;
  visible: boolean;
};

export default function Report(props: ReportProps) {
  const colors = theme();
  const [reported, setReported] = useState(false);
  const grey = colors.primary === "white" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";

  const click = async () => {
    try {
      setReported(true);

      await axios.post(
        process.env.NODE_ENV === "production" ? "https://mood.ai/api/report" : "http://localhost:3000/api/report",
        {
          text: props.text,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      onPress={click}
      style={({ pressed }) => [
        pressedDefault(pressed),
        styles.container,
        { gap: Device.deviceType !== 1 ? 6 : 4, display: props.visible ? "flex" : "none" },
      ]}
      hitSlop={8}
      disabled={reported}
    >
      <Flag
        color={grey}
        size={Device.deviceType !== 1 ? 24 : 16}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 1.5 : 1}
      />

      <Text
        style={{
          fontFamily: "Circular-Book",
          color: grey,
          fontSize: Device.deviceType !== 1 ? 16 : 12,
        }}
        allowFontScaling={false}
      >
        {reported ? "Received!" : "Report"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
});

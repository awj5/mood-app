import { StyleSheet, Text, Pressable, Alert } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Flag } from "lucide-react-native";
import { CheckInType } from "data/database";
import { theme, pressedDefault, getPromptData } from "utils/helpers";
import { useState } from "react";

type ReportProps = {
  text: string;
  visible: boolean;
  checkIns?: CheckInType[];
  func?: () => void;
};

export default function Report(props: ReportProps) {
  const colors = theme();
  const db = useSQLiteContext();
  const [reported, setReported] = useState(false);
  const grey = colors.primary === "white" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";

  const getName = async () => {
    try {
      const name = await AsyncStorage.getItem("first-name");
      return name;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  const deleteInsightsData = async (ids: number[]) => {
    try {
      // Delete insight
      const query = `
        DELETE FROM insights WHERE check_ins = ?
      `;

      await db.runAsync(query, [ids.toString()]);
      if (props.func) props.func(); // Regenerate insights
    } catch (error) {
      console.log(error);
    }
  };

  const confirm = () => {
    Alert.alert(
      "Report bad response",
      "By tapping 'Send' this response will be anonymously submitted to our team for review. Thanks for your feedback!",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "Send", onPress: send },
      ]
    );
  };

  const send = async () => {
    // Remove saved summary
    if (props.checkIns) {
      const promptData = getPromptData(props.checkIns);
      deleteInsightsData(promptData.ids);
    } else {
      setReported(true);
    }

    const name = await getName(); // Redact user's name

    // Send email to team
    try {
      await axios.post(
        process.env.NODE_ENV === "production" ? "https://mood.ai/api/report" : "http://localhost:3000/api/report",
        {
          text: name ? props.text.replace(new RegExp(name, "gi"), "[USER]") : props.text,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      onPress={confirm}
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
        size={Device.deviceType !== 1 ? 20 : 16}
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

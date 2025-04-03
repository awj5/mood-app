import { View, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { MessageCircle, NotebookPen, TrendingUp, Flame, FileText } from "lucide-react-native";
import Item from "./features/Item";

export default function Features() {
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: spacing,
          padding: spacing * 1.5,
          gap: spacing,
        },
      ]}
    >
      <Item icon={MessageCircle}>Chat with AI that gets how you feel</Item>
      <Item icon={NotebookPen}>See clear summaries of your check-ins</Item>
      <Item icon={TrendingUp}>Track trends with AI-powered insights</Item>
      <Item icon={Flame}>Detect early signs of burnout</Item>
      <Item icon={FileText}>Create custom reports to work smarter</Item>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});

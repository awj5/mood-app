import { useEffect, useState } from "react";
import { ScrollView, KeyboardAvoidingView, Platform, Pressable, Text, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";
import { useHeaderHeight, HeaderBackButton } from "@react-navigation/elements";
import { Sparkles } from "lucide-react-native";
import Response from "components/chat/Response";
import Input from "components/chat/Input";
import { pressedDefault, theme } from "utils/helpers";

type MessageType = {
  author: string;
  text: string;
};

export default function Chat() {
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const colors = theme();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const headerTextSize = Device.deviceType !== 1 ? 20 : 16;

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        {
          author: "ai",
          text: "You've just completed your first check in!",
        },
      ]);
    }, 500); // Wait for screen transition

    return () => clearTimeout(timer);
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={headerHeight}
    >
      <Stack.Screen
        options={{
          gestureEnabled: false, // Stop swipe back (only works on iOS)
          headerTitle: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => router.dismissAll()}
              label="Home"
              labelStyle={{ fontFamily: "Circular-Book", fontSize: headerTextSize }}
              tintColor={colors.primary}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => alert("Coming soon")}
              style={({ pressed }) => [
                styles.headerRight,
                pressedDefault(pressed),
                { gap: Device.deviceType !== 1 ? 12 : 8 },
              ]}
              hitSlop={16}
            >
              <Sparkles
                color={colors.primary}
                size={Device.deviceType !== 1 ? 32 : 24}
                absoluteStrokeWidth
                strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
              />

              <Text
                style={{ fontFamily: "Circular-Bold", fontSize: headerTextSize, color: colors.primary }}
                allowFontScaling={false}
              >
                Acme, Inc. Insights
              </Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView>
        {messages.map((item, index) => (
          <Response key={index} text={item.text} latest={index + 1 === messages.length} />
        ))}
      </ScrollView>

      <Input />
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});

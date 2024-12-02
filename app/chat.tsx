import { useEffect, useRef, useState } from "react";
import { ScrollView, KeyboardAvoidingView, Platform, Pressable, Text, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHeaderHeight, HeaderBackButton } from "@react-navigation/elements";
import { Sparkles } from "lucide-react-native";
import Response from "components/chat/Response";
import Message from "components/chat/Message";
import Input from "components/chat/Input";
import { pressedDefault, theme } from "utils/helpers";

export type MessageType = {
  author: string;
  text: string;
};

export default function Chat() {
  const params = useLocalSearchParams<{ checkIn: string }>();
  const db = useSQLiteContext();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const colors = theme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [generating, setGenerating] = useState(true);
  const headerTextSize = Device.deviceType !== 1 ? 20 : 16;

  const getCheckInCount = async () => {
    try {
      const query = `
    SELECT * FROM check_ins
  `;

      const rows = await db.getAllAsync(query);
      return rows.length;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const getName = async () => {
    try {
      const name = await AsyncStorage.getItem("first-name");
      return name;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  const setFirstResponse = async () => {
    const name = await getName();

    if (!name) {
      // User has not shared name yet
      const count = await getCheckInCount();

      setMessages([
        {
          author: "ai",
          text: `${
            count === 1 ? "You've just completed your first check in!\n\n" : ""
          }I'm MOOD, I help you navigate your feelings at work.\n\nWhat's your first name?`,
        },
      ]);
    } else {
      addResponse(); // User has shared name
    }
  };

  const addResponse = async () => {
    setGenerating(true);

    // Add empty response to show loader
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        author: "ai",
        text: "",
      },
    ]);

    // !!!!!!! - Placeholder
    setTimeout(() => {
      // Update the text of the last message
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].text = "Here is the updated response text!";
        return updatedMessages;
      });
    }, 2000);
  };

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].author === "user") addResponse(); // Reply if last message is from user

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFirstResponse();
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

      <ScrollView ref={scrollViewRef}>
        {messages.map((item, index) =>
          item.author === "ai" ? (
            <Response
              key={index}
              text={item.text}
              generating={index + 1 === messages.length ? generating : false}
              setGenerating={setGenerating}
            />
          ) : (
            <Message key={index} text={item.text} />
          )
        )}
      </ScrollView>

      <Input generating={generating} setMessages={setMessages} />
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

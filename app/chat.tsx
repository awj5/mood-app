import { useEffect, useRef, useState } from "react";
import { ScrollView, KeyboardAvoidingView, Platform, Pressable, Text, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { getLocales } from "expo-localization";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHeaderHeight, HeaderBackButton } from "@react-navigation/elements";
import { Sparkles } from "lucide-react-native";
import { CheckInType } from "data/database";
import Response from "components/chat/Response";
import Message from "components/chat/Message";
import Input from "components/chat/Input";
import { convertToISO, getPromptData, pressedDefault, theme } from "utils/helpers";

export type MessageType = {
  role: string;
  content: string;
};

export default function Chat() {
  const db = useSQLiteContext();
  const localization = getLocales();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const colors = theme();
  const scrollViewRef = useRef<ScrollView>(null);
  const chatHistoryRef = useRef<MessageType[]>([]);
  const checkInIDRef = useRef(0);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [generating, setGenerating] = useState(true);

  const requestAIResponse = async () => {
    try {
      const response = await axios.post(
        process.env.NODE_ENV === "production" ? "https://mood.ai/api/ai" : "http://localhost:3000/api/ai",
        {
          type: "chat",
          uuid: "79abe3a0-0706-437b-a3e4-8f8613341b9c", // WIP!!!!! - Will be stored locally
          message: chatHistoryRef.current,
          loc: localization[0].languageTag,
        }
      );

      return response.data.response;
    } catch (error) {
      console.log(error);
    }
  };

  const getCheckInHistoryData = async () => {
    try {
      const end = new Date(); // Today
      const start = new Date(end);
      start.setDate(start.getDate() - 90); // 90 days ago

      const rows: CheckInType[] = await db.getAllAsync(
        `SELECT * FROM check_ins WHERE DATE(datetime(date, 'localtime')) BETWEEN ? AND ? ORDER BY id ASC`,
        [convertToISO(start), convertToISO(end)]
      );

      const promptData = getPromptData(rows); // Convert
      checkInIDRef.current = promptData.ids[promptData.ids.length - 1]; // Latest check-in
      return promptData.data;
    } catch (error) {
      console.log(error);
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
    const history = await getCheckInHistoryData(); // Get recent check-ins

    if (history) {
      // Share most recent check-in with AI
      chatHistoryRef.current = [
        {
          role: "user",
          content: `${name ? `My name is ${name}. ` : ""}Please analyze today's check-in: ${JSON.stringify(
            history[history.length - 1]
          )}.${
            history.length > 1 ? ` Here is my recent check-in history: ${JSON.stringify(history.slice(0, -1))}.` : ""
          }`,
        },
      ];
    }

    if (!name) {
      // User has not shared name yet
      setMessages([
        {
          role: "assistant",
          content: `${
            history?.length === 1 ? "You've just completed your first check in!\n\n" : ""
          }I'm MOOD, I help you navigate your feelings at work.\n\nWhat's your first name?`,
        },
      ]);
    } else {
      addResponse(); // User has shared name
    }
  };

  const addResponse = async () => {
    setGenerating(true);
    let name = await getName();
    const latestMessage = messages[messages.length - 1];

    // Check if last message is user's name
    if (!name) {
      try {
        name = latestMessage.content.substring(0, 30).trim();
        await AsyncStorage.setItem("first-name", name); // Store name
      } catch (error) {
        console.log(error);
      }

      // Let AI know user's name
      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        {
          role: "user",
          content: `My name is ${name}.`,
        },
      ];
    } else if (messages.length) {
      chatHistoryRef.current = [...chatHistoryRef.current, latestMessage]; // Add user message to chat history
    }

    // Add empty response to show loader
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "assistant",
        content: "",
      },
    ]);

    const aiResponse = await requestAIResponse();
    let response = "";

    // Save AI response to chat history and storee conversation summary
    if (aiResponse) {
      const delimiter = "===";
      const index = aiResponse.indexOf(delimiter);
      response = index !== -1 ? aiResponse.substring(0, index).trim() : aiResponse; // Extract response
      chatHistoryRef.current = [...chatHistoryRef.current, { role: "assistant", content: response }];

      // Update check-in note
      if (index !== -1) {
        try {
          await db.runAsync("UPDATE check_ins SET note = ? WHERE id = ?", [
            aiResponse.substring(index + delimiter.length).trim(), // Extract summary
            checkInIDRef.current,
          ]);
        } catch (error) {
          console.log(error);
        }
      }
    }

    // Update the text of the last message
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];

      updatedMessages[updatedMessages.length - 1].content = aiResponse
        ? response
        : "Sorry, I'm unable to respond at the moment.";

      return updatedMessages;
    });
  };

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].role === "user") addResponse(); // Reply if last message is from user

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
              labelStyle={{ fontFamily: "Circular-Book", fontSize: Device.deviceType !== 1 ? 20 : 16 }}
              tintColor={colors.primary}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
          headerRight: () => (
            <Pressable
              //onPress={() => router.push("company-dash")}
              onPress={() => alert("Coming soon")}
              style={({ pressed }) => [
                styles.headerRight,
                pressedDefault(pressed),
                { gap: Device.deviceType !== 1 ? 10 : 6 },
              ]}
              hitSlop={16}
            >
              <Sparkles
                color={colors.primary}
                size={Device.deviceType !== 1 ? 28 : 20}
                absoluteStrokeWidth
                strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
              />

              <Text
                style={{
                  fontFamily: "Circular-Medium",
                  fontSize: Device.deviceType !== 1 ? 20 : 16,
                  color: colors.primary,
                }}
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
          item.role === "assistant" ? (
            <Response
              key={index}
              text={item.content}
              generating={index + 1 === messages.length ? generating : false}
              setGenerating={setGenerating}
            />
          ) : (
            <Message key={index} text={item.content} />
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

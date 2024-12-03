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
import { convertToISO, getPromptData, pressedDefault, theme, PromptDataType } from "utils/helpers";

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
  const checkInHistoryRef = useRef<PromptDataType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [generating, setGenerating] = useState(true);
  const headerTextSize = Device.deviceType !== 1 ? 20 : 16;

  const callAIAPI = async (name: string) => {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are MOOD, a thoughtful and empathetic AI assistant for the MOOD.ai app. Users share daily workplace mood check-ins with you, including the date, time, a list of emotions, and a reflective statement. Your primary role is to analyze their most recent check-in by identifying patterns, trends, or notable observations in their emotional state and to act as a reflective and understanding soundboard, helping them explore their feelings. Refer to the user's check-in history only if it provides relevant patterns or insights that add meaningful context to their emotions or experiences. Provide concise, meaningful summaries (280 characters max), avoiding direct advice, recommendations, or suggestions for improvement. Maintain a professional and empathetic tone, ensuring your responses are clear, relatable, and easy to read. When the check-in is first shared, ask if the user would like to share more about why they are feeling this way. Adhere to the IETF language tag: ${
                localization[0].languageTag
              }. Use the user's first name: ${name}, to personalize your responses. Always structure your replies in plain text (no markdown) for optimal readability.${
                checkInHistoryRef.current.length
                  ? `This is the user's check-in history (formatted as JSON), which you can refer to for relevant insights: ${JSON.stringify(
                      checkInHistoryRef.current
                    )}.`
                  : ""
              }`,
            },
            ...chatHistoryRef.current, // Append
          ],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      return response.data;
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
      return promptData.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getCheckInCountData = async () => {
    try {
      const rows = await db.getAllAsync(`SELECT id FROM check_ins`);
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
    // Get check-ins
    const history = await getCheckInHistoryData();

    if (history) {
      checkInHistoryRef.current = history.slice(0, -1); // Exclude most recent check-in

      // Share most recent check-in with AI
      chatHistoryRef.current = [
        {
          role: "user",
          content: `Analyze today's check-in and briefly summarize the key trends, patterns, or observations: ${JSON.stringify(
            history[history.length - 1]
          )}`,
        },
      ];
    }

    //await AsyncStorage.removeItem("first-name"); // Used for testing
    const name = await getName();

    if (!name) {
      // User has not shared name yet
      const count = await getCheckInCountData();

      setMessages([
        {
          role: "assistant",
          content: `${
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
    var name = await getName();
    const latestMessage = messages[messages.length - 1];

    // Check if last message is user's name
    if (!name) {
      try {
        name = latestMessage.content.substring(0, 30).trim();
        await AsyncStorage.setItem("first-name", name); // Store name
      } catch (error) {
        console.log(error);
      }
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

    const aiResponse = await callAIAPI(name ?? "");

    // Update the text of the last message
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];

      updatedMessages[updatedMessages.length - 1].content = aiResponse
        ? aiResponse.choices[0].message.content
        : "Sorry, I'm unable to respond at the moment.";

      return updatedMessages;
    });

    // Save AI response to chat history
    if (aiResponse)
      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        { role: "assistant", content: aiResponse.choices[0].message.content },
      ];
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

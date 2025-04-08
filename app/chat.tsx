import { useEffect, useRef, useState } from "react";
import { ScrollView, KeyboardAvoidingView, Platform, Pressable, Text, StyleSheet, Keyboard } from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { getLocales } from "expo-localization";
import axios from "axios";
import { useHeaderHeight, HeaderBackButton } from "@react-navigation/elements";
import { ChartSpline } from "lucide-react-native";
import MoodsData from "data/moods.json";
import { CheckInType } from "data/database";
import Response from "components/chat/Response";
import Message from "components/chat/Message";
import Input from "components/chat/Input";
import { pressedDefault, theme, getStoredVal, setStoredVal, removeAccess } from "utils/helpers";
import { getPromptData, PromptDataType } from "utils/data";
import { convertToISO } from "utils/dates";

export type MessageType = {
  role: string;
  content: string;
  button?: string;
  height?: number;
};

export default function Chat() {
  const db = useSQLiteContext();
  const localization = getLocales();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const colors = theme();
  const scrollViewRef = useRef<ScrollView>(null);
  const chatHistoryRef = useRef<MessageType[]>([]);
  const noteRef = useRef("");
  const checkInRef = useRef<PromptDataType>();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [generating, setGenerating] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [focusInput, setFocusInput] = useState(false);
  const [company, setCompany] = useState("");
  const [insightsSeen, setInsightsSeen] = useState(false);

  const requestAIResponse = async (type: string, uuid?: string | null, proID?: string | null) => {
    try {
      const response = await axios.post(
        Constants.appOwnership !== "expo" ? "https://mood.ai/api/ai" : "http://localhost:3000/api/ai",
        {
          type: type,
          uuid: uuid,
          message: chatHistoryRef.current,
          loc: localization[0].languageTag,
          ...(uuid !== undefined && uuid != null && { uuid: uuid }),
          ...(proID !== undefined && proID != null && { proid: proID }),
        }
      );

      return response.data.response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) removeAccess(); // User doesn't exist
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
      checkInRef.current = promptData.data[promptData.data.length - 1]; // Latest check-in
      return promptData.data;
    } catch (error) {
      console.log(error);
    }
  };

  const setFirstResponse = async () => {
    const name = await getStoredVal("first-name");
    const history = await getCheckInHistoryData(); // Get recent check-ins
    const companyName = await getStoredVal("company-name");

    if (history) {
      // Share most recent check-in with AI
      chatHistoryRef.current = [
        {
          role: "user",
          content: `${name ? `My name is ${name}. ` : ""}${
            companyName ? `I work at ${companyName}. ` : ""
          }Please analyze today's check-in: ${JSON.stringify(history[history.length - 1])}.${
            history.length > 1
              ? ` For reference, here is my recent check-in history: ${JSON.stringify(history.slice(0, -1))}.`
              : ""
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
          }I'm MOOD, I help you navigate your feelings at work using ${
            localization[0].languageTag === "en-US" ? "color" : "colour"
          } as a research-backed emotional framework.\n\nWhat's your first name?`,
          height: Device.deviceType !== 1 ? 160 : 112,
        },
      ]);
    } else {
      addResponse(); // User has shared name
    }
  };

  const addResponse = async () => {
    setGenerating(true);
    let name = await getStoredVal("first-name");
    const uuid = await getStoredVal("uuid"); // Check if customer employee
    const proID = await getStoredVal("pro-id"); // Check if Pro subscriber
    const latestMessage = messages[messages.length - 1];
    const aiResponseCount = chatHistoryRef.current.filter((message) => message.role === "assistant").length;

    // Check if last message is user's name
    if (!name) {
      name = latestMessage.content.substring(0, 30).trim();
      setStoredVal("first-name", name);

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
      if (!uuid && !proID) noteRef.current = `${noteRef.current}${noteRef.current && "\n\n"}${latestMessage.content}`; // Add message to note if user not subscribed
    }

    // Add empty response to show loader
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "assistant",
        content: "",
        height: !uuid && !proID && aiResponseCount < 2 ? (Device.deviceType !== 1 ? 320 : 256) : undefined,
      },
    ]);

    const mood = MoodsData.filter((mood) => mood.id === checkInRef.current?.mood)[0];

    const aiResponse =
      proID || uuid
        ? await requestAIResponse("chat", uuid, proID)
        : aiResponseCount >= 2
        ? "I've updated this check-in with your message."
        : aiResponseCount
        ? `Thanks for sharing, ${name}. To have a deeper chat with me, you'll need a MOOD.ai Pro subscription. However, I've archived what you've shared here for your future reference.\n\nAnything else you'd like to add?`
        : `Hi ${name}, thanks for checking in. The ${
            localization[0].languageTag === "en-US" ? "color" : "colour"
          } you selected, ${mood.description}\n\nWould you like to share more about what's contributing to your ${
            mood.name
          } mood?`;

    if (!uuid && !proID) await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay response if user doesn't have AI access

    // Update the text of the last message
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];

      // Message
      updatedMessages[updatedMessages.length - 1].content = aiResponse
        ? aiResponse
        : "Sorry, I'm unable to respond at the moment.";

      // Button
      updatedMessages[updatedMessages.length - 1].button = !aiResponseCount
        ? "respond"
        : !uuid && !proID && aiResponseCount === 1
        ? "upsell"
        : undefined;

      return updatedMessages;
    });

    // Save AI response to chat history and store conversation summary
    if (aiResponse) {
      chatHistoryRef.current = [...chatHistoryRef.current, { role: "assistant", content: aiResponse }];

      // Only save summary if user has replied
      if (chatHistoryRef.current.filter((message) => message.role === "assistant").length >= 2) {
        const aiSummary =
          uuid || proID
            ? await requestAIResponse("summarize_chat", uuid, proID)
            : "[NOTE FROM USER]:" + noteRef.current;

        if (aiSummary) {
          // Update check-in note
          try {
            await db.runAsync("UPDATE check_ins SET note = ? WHERE id = ?", [aiSummary, checkInRef.current?.id]);
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  };

  const getCompany = async () => {
    const name = await getStoredVal("company-name");
    const send = await getStoredVal("send-check-ins");
    if (name) setCompany(name);
    if (send) setInsightsSeen(true);
  };

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].role === "user") addResponse(); // Reply if last message is from user

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages]);

  useEffect(() => {
    if (!generating && !showInput && messages[messages.length - 1].content.includes("What's your first name?"))
      setShowInput(true);
  }, [generating]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFirstResponse();
    }, 500); // Wait for screen transition

    const listener = Keyboard.addListener("keyboardDidShow", () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    getCompany();

    return () => {
      clearTimeout(timer);
      listener.remove();
    };
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
              label="Dashboard"
              labelStyle={{ fontFamily: "Circular-Book", fontSize: Device.deviceType !== 1 ? 20 : 16 }}
              tintColor={colors.primary}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push("company")}
              style={({ pressed }) => [
                styles.headerRight,
                pressedDefault(pressed),
                { gap: Device.deviceType !== 1 ? 10 : 6 },
              ]}
              hitSlop={16}
            >
              <ChartSpline
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
                {company ? company + " Insights" : "Company Insights"}
              </Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
        {messages.map((item, index) =>
          item.role === "assistant" ? (
            <Response
              key={index}
              message={item}
              generating={index + 1 === messages.length ? generating : false}
              setGenerating={setGenerating}
              showInput={showInput}
              setShowInput={setShowInput}
              setFocusInput={setFocusInput}
              company={company}
              insightsSeen={insightsSeen}
            />
          ) : (
            <Message key={index} text={item.content} />
          )
        )}
      </ScrollView>

      <Input
        generating={generating}
        setMessages={setMessages}
        showInput={showInput}
        focusInput={focusInput}
        setFocusInput={setFocusInput}
      />

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

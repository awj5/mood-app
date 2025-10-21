import { useEffect, useRef, useState } from "react";
import { ScrollView, KeyboardAvoidingView, Platform, Pressable, Text, Keyboard, useColorScheme } from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Network from "expo-network";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { getLocales } from "expo-localization";
import { useHeaderHeight, HeaderBackButton } from "@react-navigation/elements";
import { ChartSpline } from "lucide-react-native";
import MoodsData from "data/moods.json";
import HelpData from "data/help.json";
import Response from "components/chat/Response";
import Message from "components/chat/Message";
import Input from "components/chat/Input";
import { CheckInType, PromptCheckInType, MessageType } from "types";
import { pressedDefault, getStoredVal, setStoredVal, getTheme } from "utils/helpers";
import { getPromptCheckIns, requestAIResponse } from "utils/data";

export default function Chat() {
  const db = useSQLiteContext();
  const localization = getLocales();
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const scrollViewRef = useRef<ScrollView>(null);
  const chatHistoryRef = useRef<MessageType[]>([]);
  const noteRef = useRef("");
  const currentCheckInRef = useRef<PromptCheckInType>();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [generating, setGenerating] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [focusInput, setFocusInput] = useState(false);
  const [company, setCompany] = useState("");

  const getCheckInHistoryData = async () => {
    try {
      const rows: CheckInType[] = await db.getAllAsync("SELECT * FROM check_ins ORDER BY id DESC LIMIT 100");
      const promptCheckIns = getPromptCheckIns(rows); // Format for AI
      currentCheckInRef.current = promptCheckIns.data[0]; // Latest check-in
      return promptCheckIns.data;
    } catch (error) {
      console.error(error);
    }
  };

  const setFirstResponse = async () => {
    const history = await getCheckInHistoryData(); // Get recent check-ins
    const name = await getStoredVal("first-name");
    const companyName = await getStoredVal("company-name");

    if (history) {
      // Share most recent check-in with AI
      chatHistoryRef.current = [
        {
          role: "user",
          content: `${name ? `My name is ${name}. ` : ""}${
            companyName ? `I work at ${companyName}. ` : ""
          }Please analyze today's check-in: ${JSON.stringify(history[0])}.${
            history.length > 1
              ? ` For reference, here is my recent check-in history: ${JSON.stringify(history.slice(1))}.`
              : ""
          }`,
        },
      ];
    }

    if (!name) {
      // User has not shared name yet so ask for their first name
      setMessages([
        {
          role: "assistant",
          content: `${
            history?.length === 1 ? "You've just completed your first check-in. Nice one!\n\n" : ""
          }I'm MOOD, I use ${
            localization[0].languageTag === "en-US" ? "color" : "colour"
          } and emotion science to help you understand your feelings at ${
            company ? company : "work"
          }, all privately of course.\n\nWhat's your first name?`,
          height: Device.deviceType !== 1 ? 160 : 112,
        },
      ]);
    } else {
      addResponse(); // User has shared name
    }
  };

  const addResponse = async () => {
    setGenerating(true);
    const network = await Network.getNetworkStateAsync();
    let name = await getStoredVal("first-name");
    const uuid = await getStoredVal("uuid"); // Check if employee
    const proID = await getStoredVal("pro-id"); // Check if Pro subscriber
    const latestMessage = messages[messages.length - 1];
    const aiResponseCount = chatHistoryRef.current.filter((message) => message.role === "assistant").length;
    let help = false;

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
      help = HelpData.some((string) => latestMessage.content.toLowerCase().includes(string.toLowerCase())); // Detect words to trigger urgent care link
      chatHistoryRef.current = [...chatHistoryRef.current, latestMessage]; // Add user message to chat history
      if (!uuid && !proID) noteRef.current = `${noteRef.current}${noteRef.current && "\n\n"}${latestMessage.content}`; // Add message to note if user doesn't have Pro
    }

    // Add empty response to show loader
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "assistant",
        content: "",
        height: !uuid && !proID && aiResponseCount < 2 ? (Device.deviceType !== 1 ? 320 : 256) : undefined,
        hasPro: !!(uuid || proID),
      },
    ]);

    const mood = MoodsData.filter((mood) => mood.id === currentCheckInRef.current?.mood)[0]; // Mood of latest check-in

    const aiResponse =
      proID || uuid
        ? await requestAIResponse("chat", chatHistoryRef.current, uuid, proID)
        : help
        ? `Feeling overwhelmed, unsafe, or having thoughts of self-harm? You're not alone, ${name}. Support is available.\n\nTap the link below to connect with trusted, confidential services that can help right now.`
        : aiResponseCount >= 2
        ? "I've updated this check-in with your message."
        : aiResponseCount
        ? `Thanks for sharing, ${name}. To have a deeper chat with me, you'll need MOOD.ai Pro. However, I've archived what you've shared here for your future reference.\n\nAnything else you'd like to add?`
        : `Hi ${name}, thanks for checking in. ${mood.description}\n\nWould you like to share more about what's contributing to your ${mood.name} mood?`;

    if (!uuid && !proID) await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay response if user doesn't have AI access

    // Update the last message
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];

      // Message
      updatedMessages[updatedMessages.length - 1].content = aiResponse
        ? aiResponse
        : network.isInternetReachable
        ? "Sorry, I'm unable to respond at the moment."
        : "Sorry, you must be online to chat with me.";

      // Button
      updatedMessages[updatedMessages.length - 1].button = help
        ? "help"
        : !aiResponseCount && aiResponse && network.isInternetReachable
        ? "respond"
        : !uuid && !proID && aiResponseCount === 1
        ? "upsell"
        : undefined;

      return updatedMessages;
    });

    // Save AI response to chat history and store conversation summary
    if (aiResponse) {
      chatHistoryRef.current = [
        ...chatHistoryRef.current,
        { role: "assistant", content: proID || uuid || !aiResponseCount ? aiResponse : "" },
      ];

      // Only save summary if user has replied
      if (chatHistoryRef.current.filter((message) => message.role === "assistant").length >= 2) {
        const aiSummary =
          uuid || proID
            ? await requestAIResponse("summarize_chat", chatHistoryRef.current.slice(1), uuid, proID)
            : "[NOTE FROM USER]:" + noteRef.current;

        if (aiSummary) {
          // Update check-in note
          try {
            await db.runAsync("UPDATE check_ins SET note = ? WHERE id = ?", [aiSummary, currentCheckInRef.current?.id]);
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (messages.length && messages[messages.length - 1].role === "user") addResponse(); // Reply if last message is from user

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages]);

  useEffect(() => {
    // Show input if AI has asked for user's name
    if (!generating && !showInput && messages[messages.length - 1].content.includes("What's your first name?"))
      setShowInput(true);
  }, [generating]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFirstResponse();
    }, 500); // Wait for screen transition

    (async () => {
      // Check if user has a company
      const companyName = await getStoredVal("company-name");
      if (companyName) setCompany(companyName);
    })();

    const didShowListener = Keyboard.addListener("keyboardDidShow", () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    return () => {
      clearTimeout(timer);
      didShowListener.remove();
    };
  }, [company]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0}
    >
      <Stack.Screen
        options={{
          gestureEnabled: false, // Stop swipe back (only works on iOS)
          headerTitle: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => router.dismissAll()}
              label="Dashboard"
              labelStyle={{ fontFamily: "Circular-Book", fontSize: theme.fontSize.body }}
              tintColor={theme.color.link}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => router.push("company")}
              style={({ pressed }) => [
                pressedDefault(pressed),
                { gap: theme.spacing.small / 2, flexDirection: "row", alignItems: "center" },
              ]}
              hitSlop={16}
            >
              <ChartSpline
                color={theme.color.link}
                size={theme.icon.base.size}
                absoluteStrokeWidth
                strokeWidth={theme.icon.base.stroke}
              />

              <Text
                style={{
                  fontFamily: "Circular-Bold",
                  fontSize: theme.fontSize.body,
                  color: theme.color.link,
                }}
                allowFontScaling={false}
              >
                {company ? company + " Insights" : "Company Insights"}
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
              message={item}
              generating={index + 1 === messages.length ? generating : false}
              setGenerating={setGenerating}
              showInput={showInput}
              setShowInput={setShowInput}
              setFocusInput={setFocusInput}
              company={company}
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

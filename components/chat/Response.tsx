import { useEffect, useState } from "react";
import { View, Linking, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import ParsedText from "react-native-parsed-text";
import Icon from "./response/Icon";
import Report from "components/Report";
import Buttons from "./response/Buttons";
import { MessageType } from "types";
import { getTheme } from "utils/helpers";

type ResponseProps = {
  message: MessageType;
  generating: boolean;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  showInput: boolean;
  setShowInput: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusInput: React.Dispatch<React.SetStateAction<boolean>>;
  company?: string;
  insightsSeen?: boolean;
};

export default function Response(props: ResponseProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const words = props.message.content
    .replace(/\n\n/g, " \n\n") // Handle double linebreaks
    .replace(/(?<!\n)\n(?!\n)/g, " \n") // Handle single linebreaks (exclude doubles)
    .split(" ");

  const colorPress = (name: string) => {
    router.push({
      pathname: "mood",
      params: {
        name: name,
      },
    });
  };

  const linkPress = (url: string) => {
    Linking.openURL(url);
  };

  const emailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch((err) => console.error("Failed to open email URL:", err));
  };

  useEffect(() => {
    if (props.message.content) {
      // Type out word by word
      const timer = setTimeout(() => {
        if (index < words.length) {
          setDisplayedText((prev) => prev + words[index] + " ");
          setIndex(index + 1);
        } else {
          props.setGenerating(false); // Finished
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [index, props.message.content]);

  return (
    <View
      style={{
        flexDirection: "row",
        minHeight: props.message.height ? props.message.height : Device.deviceType === 1 ? 208 : 240,
        padding: theme.spacing.base,
        gap: theme.spacing.small,
      }}
    >
      <Icon generating={props.generating} />

      <View
        style={{
          gap: theme.spacing.base,
          flex: 1,
          maxWidth: 512,
        }}
      >
        <View style={{ gap: theme.spacing.base / 2 }}>
          <ParsedText
            parse={[
              {
                pattern: /\b(Orange|Yellow|Lime|Green|Mint|Cyan|Azure|Blue|Violet|Plum|Maroon|Red)\b/,
                style: { textDecorationLine: "underline", fontFamily: "Circular-Medium" },
                onPress: colorPress,
              },
              {
                pattern: /MOOD.ai Pro/,
                style: { fontFamily: "Circular-Bold" },
              },
              {
                pattern: /MOOD/,
                style: { fontFamily: "Circular-Black" },
              },
              {
                type: "url",
                style: { color: theme.color.link },
                onPress: linkPress,
                renderText(matchingString) {
                  const text = matchingString.endsWith("/") ? matchingString.slice(0, -1) : matchingString;
                  return text.replace("https://", "").replace("http://", "").replace("www.", "");
                },
              },
              {
                pattern: /[\w.-]+@[\w.-]+\.\w{2,}/,
                style: { color: theme.color.link },
                onPress: emailPress,
                renderText: (text) => text.replace(/[.,;!?]+$/, ""),
              },
            ]}
            style={{
              color: theme.color.primary,
              fontSize: theme.fontSize.body,
              fontFamily: "Circular-Book",
            }}
          >
            {displayedText}
          </ParsedText>

          <Report text={displayedText} visible={!props.generating} />
        </View>

        {(!props.generating && props.message.button) || (!props.generating && !displayedText.includes("?")) ? (
          <Buttons
            message={props.message}
            displayedText={displayedText}
            showInput={props.showInput}
            setShowInput={props.setShowInput}
            setFocusInput={props.setFocusInput}
            company={props.company}
            insightsSeen={props.insightsSeen}
          />
        ) : null}
      </View>
    </View>
  );
}

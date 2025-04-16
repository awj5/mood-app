import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { Sparkles, ChartSpline } from "lucide-react-native";
import ParsedText from "react-native-parsed-text";
import { MessageType } from "app/chat";
import Icon from "./response/Icon";
import Report from "components/Report";
import Button from "components/Button";
import { theme } from "utils/helpers";

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
  const colors = theme();
  const router = useRouter();
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const words = props.message.content
    .replace(/\n\n/g, " \n\n") // Handle double linebreaks
    .replace(/(?<!\n)\n(?!\n)/g, " \n") // Handle single linebreaks (exclude doubles)
    .split(" ");

  const buttonClick = () => {
    if (props.message.button === "upsell") {
      router.push("pro");
    } else {
      router.dismissAll();
    }
  };

  const showInput = () => {
    if (!props.showInput) props.setShowInput(true);
    props.setFocusInput(true);
  };

  const colorPress = (name: string) => {
    router.push({
      pathname: "mood",
      params: {
        name: name,
      },
    });
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
        minHeight: props.message.height ? props.message.height : Device.deviceType !== 1 ? 240 : 208,
        padding: spacing,
        gap: Device.deviceType !== 1 ? 20 : 12,
      }}
    >
      <Icon generating={props.generating} />

      <View style={[styles.wrapper, { gap: spacing }]}>
        <View style={{ gap: spacing / 2 }}>
          <ParsedText
            parse={[
              {
                pattern: /Orange|Yellow|Lime|Green|Mint|Cyan|Azure|Blue|Violet|Aubergine|Burgundy|Red/,
                style: styles.color,
                onPress: colorPress,
              },
              {
                pattern: /MOOD.ai Pro|MOOD.ai|MOOD/,
                style: { fontFamily: "Circular-Bold" },
              },
            ]}
            style={[
              styles.text,
              {
                color: colors.primary,
                fontSize: Device.deviceType !== 1 ? 20 : 16,
              },
            ]}
          >
            {displayedText}
          </ParsedText>

          <Report text={displayedText} visible={!props.generating} />
        </View>

        {(!props.generating && props.message.button) || (!props.generating && displayedText.indexOf("?") === -1) ? (
          <Animated.View
            entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
            style={{ gap: spacing, alignSelf: "flex-start" }}
          >
            <View style={{ gap: spacing, flexDirection: "row" }}>
              {props.message.button === "respond" && <Button func={showInput}>Let's chat</Button>}

              <Button
                func={buttonClick}
                fill={props.message.button === "upsell"}
                icon={
                  props.message.button === "upsell" || (props.message.button !== "respond" && props.message.hasAccess)
                    ? Sparkles
                    : undefined
                }
                gradient={props.message.button === "upsell"}
              >
                {props.message.button === "upsell"
                  ? "Try Pro for FREE"
                  : props.message.button === "respond"
                  ? "Not right now"
                  : "View my dashboard"}
              </Button>
            </View>

            {((props.company && !props.message.button && displayedText.indexOf("?") === -1) ||
              (props.company && props.message.button === "respond" && !props.insightsSeen)) && (
              <View style={{ alignSelf: "flex-start" }}>
                <Button route="company" icon={ChartSpline}>{`View ${props.company} insights`}</Button>
              </View>
            )}
          </Animated.View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    maxWidth: 512,
  },
  text: {
    flexShrink: 1,
    fontFamily: "Circular-Book",
  },
  color: {
    textDecorationLine: "underline",
    fontFamily: "Circular-Bold",
  },
});

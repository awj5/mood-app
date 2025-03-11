import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { Sparkles } from "lucide-react-native";
import Icon from "./response/Icon";
import Report from "components/Report";
import Button from "components/Button";
import { theme } from "utils/helpers";

type ResponseProps = {
  text: string;
  generating: boolean;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  button?: string; // dash, company, upsell
};

export default function Response(props: ResponseProps) {
  const colors = theme();
  const router = useRouter();
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const words = props.text
    .replace(/\n\n/g, " \n\n") // Handle double linebreaks
    .replace(/(?<!\n)\n(?!\n)/g, " \n") // Handle single linebreaks (exclude doubles)
    .split(" ");

  const buttonClick = () => {
    if (props.button === "company") {
      alert("Coming soon");
    } else if (props.button === "upsell") {
      alert("Coming soon");
    } else {
      router.dismissAll();
    }
  };

  useEffect(() => {
    if (props.text) {
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
  }, [index, props.text]);

  return (
    <View
      style={[
        styles.container,
        {
          padding: spacing,
          gap: Device.deviceType !== 1 ? 16 : 12,
        },
      ]}
    >
      <Icon generating={props.generating} />

      <View style={[styles.wrapper, { gap: spacing }]}>
        <View style={{ gap: Device.deviceType !== 1 ? 8 : 6 }}>
          <Text
            style={[
              styles.text,
              {
                color: colors.primary,
                fontSize: Device.deviceType !== 1 ? 20 : 16,
              },
            ]}
          >
            {displayedText}
          </Text>

          <Report text={displayedText} visible={!props.generating} />
        </View>

        {(!props.generating && props.button) || (!props.generating && displayedText.indexOf("?") === -1) ? (
          <Animated.View
            entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
            style={{ alignSelf: "flex-start" }}
          >
            <Button
              func={buttonClick}
              fill={props.button === "upsell"}
              icon={props.button === "upsell" ? Sparkles : undefined}
              gradient={props.button === "upsell"}
            >
              {props.button === "company"
                ? "View company insights"
                : props.button === "upsell"
                ? "Get MOOD.ai Pro"
                : "View my dashboard"}
            </Button>
          </Animated.View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    minHeight: 160,
  },
  wrapper: {
    flex: 1,
    maxWidth: 512,
  },
  text: {
    flexShrink: 1,
    fontFamily: "Circular-Book",
  },
});

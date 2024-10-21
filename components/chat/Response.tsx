import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import * as Device from "expo-device";
import Icon from "./Icon";
import { theme } from "utils/helpers";

export default function Response() {
  const colors = theme();
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const text =
      "Hello, I'm MOOD, your go-to resource for supporting employee psychological safety. <break>Through mood check-ins, I help you navigate how you're feeling at work and provide guidance based on the latest research from Nathan Jones, ISO standards, and your company's policies. <break>While I'm still learning and can't chat just yet, I'm excited to assist you in managing your mental well-being in the workplace soon.";

    const words = text.split(" ");

    const timer = setTimeout(
      () => {
        if (index < words.length) {
          // Type out word by word
          setDisplayedText((prev) => prev + words[index] + " ");
          setIndex(index + 1);
          setTyping(true);
        } else {
          setTyping(false); // Finished
        }
      },
      !index ? 500 : 100
    );

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <View
      style={[styles.container, { padding: Device.deviceType !== 1 ? 24 : 16, gap: Device.deviceType !== 1 ? 16 : 12 }]}
    >
      <Icon thinking={typing} />

      <Text
        style={[
          styles.text,
          {
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 20 : 16,
            marginTop: Device.deviceType !== 1 ? 14 : 10,
          },
        ]}
        allowFontScaling={false}
      >
        {displayedText.replace(/<break>/g, "\n\n")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  text: {
    flexShrink: 1,
    fontFamily: "Circular-Book",
    maxWidth: 512,
  },
});

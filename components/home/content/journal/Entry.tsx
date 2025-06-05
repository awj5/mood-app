import { useContext } from "react";
import { View, Text, useColorScheme, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import ParsedText from "react-native-parsed-text";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { CheckInType } from "types";
import { getTheme } from "utils/helpers";

type EntryProps = {
  checkIn: CheckInType;
};

export default function Entry(props: EntryProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const utc = new Date(`${props.checkIn.date}Z`);
  const local = new Date(utc);
  const time = local.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  const date = local
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(dimensions.width > 375 && { weekday: "short" }), // Don't show day on iPhone SE
    })
    .replace(",", "");

  const colorPress = (name: string) => {
    router.push({
      pathname: "mood",
      params: {
        name: name,
      },
    });
  };

  const press = () => {
    router.push({
      pathname: "day",
      params: { day: utc.getDate(), month: utc.getMonth() + 1, year: utc.getFullYear() },
    });
  };

  return (
    <View
      style={{
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.small,
      }}
    >
      <ScrollView nestedScrollEnabled={true}>
        <Pressable onPress={press} style={{ gap: theme.spacing.base / 4 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Text
              style={{
                fontFamily: "Tiempos-Bold",
                color: theme.color.inverted,
                fontSize: theme.fontSize.small,
              }}
              allowFontScaling={false}
            >
              {date}
            </Text>

            <Text
              style={{
                fontFamily: "Circular-Bold",
                color: theme.color.inverted,
                fontSize: theme.fontSize.xSmall,
              }}
              allowFontScaling={false}
            >
              {time}
            </Text>
          </View>

          <ParsedText
            parse={[
              {
                pattern: /Orange|Yellow|Lime|Green|Mint|Cyan|Azure|Blue|Violet|Plum|Maroon|Red/,
                style: { textDecorationLine: "underline" },
                onPress: colorPress,
              },
            ]}
            style={{
              fontFamily: "Circular-BookItalic",
              color: theme.color.inverted,
              fontSize: theme.fontSize.small,
              lineHeight: theme.fontSize.body,
            }}
            allowFontScaling={false}
          >
            {props.checkIn.note.replace("[NOTE FROM USER]:", "")}
          </ParsedText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

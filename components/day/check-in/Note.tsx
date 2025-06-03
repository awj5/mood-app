import { View, Text, ScrollView, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import ParsedText from "react-native-parsed-text";
import Report from "components/Report";
import { getTheme } from "utils/helpers";

type NoteProps = {
  text: string;
};

export default function Note(props: NoteProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const aiGenerated = props.text && props.text.indexOf("[NOTE FROM USER]:") === -1;

  const press = (name: string) => {
    router.push({
      pathname: "mood",
      params: {
        name: name,
      },
    });
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: theme.spacing.base,
        gap: theme.spacing.base / 4,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ gap: theme.spacing.small / 2, flexDirection: "row", alignItems: "center" }}>
          <Sparkles
            color={theme.color.primary}
            size={theme.icon.base.size}
            absoluteStrokeWidth
            strokeWidth={theme.icon.base.stroke}
            style={{
              display: aiGenerated ? "flex" : "none",
            }}
          />

          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: theme.color.primary,
              fontSize: theme.fontSize.small,
            }}
            allowFontScaling={false}
          >
            {aiGenerated ? "SUMMARY" : "NOTE"}
          </Text>
        </View>

        <Report text={props.text} visible={!!aiGenerated} opaque />
      </View>

      <ScrollView nestedScrollEnabled={true}>
        <ParsedText
          parse={[
            {
              pattern: /Orange|Yellow|Lime|Green|Mint|Cyan|Azure|Blue|Violet|Plum|Maroon|Red/,
              style: { textDecorationLine: "underline" },
              onPress: press,
            },
          ]}
          style={{
            fontFamily: props.text ? "Circular-BookItalic" : "Circular-Book",
            color: props.text ? theme.color.primary : theme.color.opaque,
            fontSize: theme.fontSize.body,
          }}
          allowFontScaling={false}
        >
          {props.text ? props.text.replace("[NOTE FROM USER]:", "") : "Not generated"}
        </ParsedText>
      </ScrollView>
    </View>
  );
}

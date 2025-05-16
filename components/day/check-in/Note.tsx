import { StyleSheet, View, Text, ScrollView } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import ParsedText from "react-native-parsed-text";
import Report from "components/Report";
import { theme } from "utils/helpers";

type NoteProps = {
  text: string;
};

export default function Note(props: NoteProps) {
  const colors = theme();
  const router = useRouter();

  const colorPress = (name: string) => {
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
        paddingHorizontal: Device.deviceType !== 1 ? 24 : 16,
        gap: Device.deviceType !== 1 ? 6 : 4,
      }}
    >
      <View style={[styles.title, { gap: Device.deviceType !== 1 ? 10 : 6 }]}>
        <Sparkles
          color={colors.primary}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
          style={{
            display: props.text && props.text.indexOf("[NOTE FROM USER]:") === -1 ? "flex" : "none",
          }}
        />

        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 18 : 14,
          }}
          allowFontScaling={false}
        >
          {props.text && props.text.indexOf("[NOTE FROM USER]:") !== -1 ? "NOTE" : "SUMMARY"}
        </Text>

        <View style={styles.report}>
          <Report
            text={props.text}
            visible={props.text && props.text.indexOf("[NOTE FROM USER]:") === -1 ? true : false}
            opaque
          />
        </View>
      </View>

      <ScrollView nestedScrollEnabled={true}>
        <ParsedText
          parse={[
            {
              pattern: /Orange|Yellow|Lime|Green|Mint|Cyan|Azure|Blue|Violet|Plum|Maroon|Red/,
              style: { textDecorationLine: "underline" },
              onPress: colorPress,
            },
          ]}
          style={{
            fontFamily: props.text ? "Circular-BookItalic" : "Circular-Book",
            color: props.text ? colors.primary : colors.opaque,
            fontSize: Device.deviceType !== 1 ? 20 : 16,
          }}
          allowFontScaling={false}
        >
          {props.text ? props.text.replace("[NOTE FROM USER]:", "") : "Not generated"}
        </ParsedText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  report: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});

import { useState } from "react";
import { StyleSheet, TextInput, View, SafeAreaView, Pressable } from "react-native";
import * as Device from "expo-device";
import { ArrowUp } from "lucide-react-native";
import Note from "./input/Note";
import { theme, pressedDefault } from "utils/helpers";

export default function Input() {
  const colors = theme();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const stroke = Device.deviceType !== 1 ? 2.5 : 2;
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const smallSpacing = Device.deviceType !== 1 ? 12 : 8;

  const press = () => {
    //
  };

  return (
    <SafeAreaView>
      <View
        style={{
          padding: spacing,
          gap: spacing,
        }}
      >
        <Note />

        <View
          style={{
            flexDirection: "row",
            borderWidth: stroke,
            borderColor: focused ? colors.primary : colors.secondary,
            borderRadius: Device.deviceType !== 1 ? 44 : 32,
          }}
        >
          <TextInput
            onChangeText={setText}
            value={text}
            placeholder="Message"
            placeholderTextColor={colors.secondary}
            style={[
              styles.input,
              {
                color: colors.primary,
                fontSize: Device.deviceType !== 1 ? 24 : 18,
                paddingVertical: smallSpacing,
                paddingLeft: Device.deviceType !== 1 ? 28 : 20,
              },
            ]}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            allowFontScaling={false}
            multiline
          />

          <Pressable
            onPress={press}
            style={({ pressed }) => [
              pressedDefault(pressed),
              styles.submit,
              {
                width: Device.deviceType !== 1 ? 56 : 40,
                margin: smallSpacing,
                borderWidth: !focused ? stroke : 0,
                borderColor: colors.secondary,
                backgroundColor: focused ? colors.primary : "transparent",
              },
            ]}
            hitSlop={8}
            disabled={!focused}
          >
            <ArrowUp
              color={!focused ? colors.secondary : colors.primary === "white" ? "black" : "white"}
              size={Device.deviceType !== 1 ? 32 : 24}
              absoluteStrokeWidth
              strokeWidth={stroke}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    fontFamily: "Circular-Book",
    maxHeight: 256,
    alignSelf: "center",
    flex: 1,
  },
  submit: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: "1/1",
    alignSelf: "flex-end",
  },
});

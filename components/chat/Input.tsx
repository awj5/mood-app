import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import * as Device from "expo-device";
import { theme } from "utils/helpers";

export default function Input() {
  const colors = theme();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ alignItems: "center", padding: Device.deviceType !== 1 ? 24 : 16 }}>
      <TextInput
        onChangeText={setText}
        value={text}
        placeholder="Message"
        placeholderTextColor={colors.secondary}
        style={[
          styles.input,
          {
            borderWidth: Device.deviceType !== 1 ? 2.5 : 2,
            borderColor: focused ? colors.primary : colors.secondary,
            color: colors.primary,
            paddingHorizontal: Device.deviceType !== 1 ? 24 : 20,
            paddingVertical: Device.deviceType !== 1 ? 16 : 12,
            fontSize: Device.deviceType !== 1 ? 24 : 18,
          },
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize="none"
        onSubmitEditing={() => setText("")}
        allowFontScaling={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 999,
    fontFamily: "Circular-Book",
    width: "100%",
  },
});

import { useRef, useState } from "react";
import { StyleSheet, TextInput, View, Pressable } from "react-native";
import * as Device from "expo-device";
import { SearchIcon, X } from "lucide-react-native";
import { theme, pressedDefault } from "utils/helpers";

type SearchProps = {
  //
};

export default function Search(props: SearchProps) {
  const colors = theme();
  const inputRef = useRef<TextInput | null>(null);
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const stroke = Device.deviceType !== 1 ? 2.5 : 2;
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const iconSize = Device.deviceType !== 1 ? 32 : 24;

  const clear = () => {
    inputRef.current?.blur();
    setText("");
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderWidth: stroke,
          borderColor: focused ? colors.primary : colors.secondary,
          marginHorizontal: spacing,
          paddingHorizontal: spacing / 1.5,
          marginBottom: spacing,
          marginTop: spacing / 2,
        },
      ]}
    >
      <Pressable onPress={() => inputRef.current?.focus()} hitSlop={8}>
        <SearchIcon
          color={focused ? colors.primary : colors.secondary}
          size={iconSize}
          absoluteStrokeWidth
          strokeWidth={stroke}
        />
      </Pressable>

      <TextInput
        ref={inputRef}
        onChangeText={setText}
        value={text}
        placeholder="Search"
        placeholderTextColor={colors.secondary}
        style={[
          styles.input,
          {
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 24 : 18,
            paddingHorizontal: spacing / 2,
            paddingVertical: spacing / 1.5,
          },
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        allowFontScaling={false}
      />

      <Pressable
        onPress={clear}
        style={({ pressed }) => [pressedDefault(pressed), { display: focused ? "flex" : "none" }]}
        hitSlop={8}
      >
        <X color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={stroke} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
  },
  input: {
    fontFamily: "Circular-Book",
    flex: 1,
  },
});

import { useRef, useState } from "react";
import { StyleSheet, TextInput, View, Pressable } from "react-native";
import * as Device from "expo-device";
import { SearchIcon, X } from "lucide-react-native";
import { theme, pressedDefault } from "utils/helpers";

type SearchProps = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

export default function Search(props: SearchProps) {
  const colors = theme();
  const inputRef = useRef<TextInput | null>(null);
  const [focused, setFocused] = useState(false);
  const stroke = Device.deviceType !== 1 ? 2.5 : 2;
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const iconSize = Device.deviceType !== 1 ? 32 : 24;

  const clear = () => {
    inputRef.current?.blur();
    props.setText("");
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderWidth: stroke,
          borderColor: focused ? colors.primary : colors.secondary,
          marginHorizontal: spacing,
          paddingHorizontal: spacing / 2,
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
        onChangeText={props.setText}
        value={props.text}
        placeholder="Search"
        placeholderTextColor={colors.secondary}
        style={[
          styles.input,
          {
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 24 : 18,
            paddingHorizontal: spacing / 2,
            paddingVertical: spacing / 2,
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

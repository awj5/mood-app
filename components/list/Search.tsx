import { useRef, useState } from "react";
import { TextInput, View, Pressable, useColorScheme } from "react-native";
import { SearchIcon, X } from "lucide-react-native";
import { pressedDefault, getTheme } from "utils/helpers";

type SearchProps = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

export default function Search(props: SearchProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const inputRef = useRef<TextInput | null>(null);
  const [focused, setFocused] = useState(false);

  const clear = () => {
    inputRef.current?.blur();
    props.setText("");
  };

  return (
    <View
      style={{
        borderWidth: theme.stroke,
        borderColor: focused ? theme.color.primary : theme.color.secondary,
        marginHorizontal: theme.spacing.base,
        paddingHorizontal: theme.spacing.small,
        marginBottom: theme.spacing.base / 2,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 999,
      }}
    >
      <Pressable onPress={() => inputRef.current?.focus()} hitSlop={8}>
        <SearchIcon
          color={focused ? theme.color.primary : theme.color.secondary}
          size={theme.icon.base.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.base.stroke}
        />
      </Pressable>

      <TextInput
        ref={inputRef}
        onChangeText={props.setText}
        value={props.text}
        placeholder="Search"
        placeholderTextColor={theme.color.secondary}
        style={{
          color: theme.color.primary,
          fontSize: theme.fontSize.large,
          paddingHorizontal: theme.spacing.base / 2,
          paddingVertical: theme.spacing.base / 2,
          fontFamily: "Circular-Book",
          flex: 1,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        allowFontScaling={false}
      />

      <Pressable
        onPress={clear}
        style={({ pressed }) => [pressedDefault(pressed), { display: focused ? "flex" : "none" }]}
        hitSlop={8}
      >
        <X
          color={theme.color.primary}
          size={theme.icon.base.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.base.stroke}
        />
      </Pressable>
    </View>
  );
}

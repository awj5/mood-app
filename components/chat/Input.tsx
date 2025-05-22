import { useEffect, useState, useRef } from "react";
import { TextInput, View, Pressable, Keyboard, useColorScheme, SafeAreaView } from "react-native";
import * as Device from "expo-device";
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle } from "react-native-reanimated";
import { ArrowUp } from "lucide-react-native";
import { MessageType } from "app/chat";
import Note from "./input/Note";
import { pressedDefault, getTheme } from "utils/helpers";

type InputProps = {
  generating: boolean;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  showInput: boolean;
  focusInput: boolean;
  setFocusInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Input(props: InputProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const inputRef = useRef<TextInput | null>(null);
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const press = () => {
    props.setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "user",
        content: text,
      },
    ]);

    setText(""); // Clear
    Keyboard.dismiss();
  };

  const blur = () => {
    setFocused(false);
    props.setFocusInput(false);
  };

  useEffect(() => {
    if (props.showInput) opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) }); // Animate in
  }, [props.showInput]);

  useEffect(() => {
    if (props.focusInput) inputRef.current?.focus();
  }, [props.focusInput]);

  return (
    <SafeAreaView>
      <Animated.View
        style={[
          animatedStyles,
          {
            padding: theme.spacing.base,
            gap: theme.spacing.base,
          },
        ]}
        pointerEvents={props.showInput ? "auto" : "none"}
      >
        <Note />

        <View
          style={{
            flexDirection: "row",
            borderWidth: theme.stroke,
            borderColor: focused ? theme.color.primary : theme.color.secondary,
            borderRadius: theme.spacing.base * 2,
          }}
        >
          <TextInput
            ref={inputRef}
            onChangeText={setText}
            value={text}
            placeholder="Message"
            placeholderTextColor={theme.color.secondary}
            style={{
              color: theme.color.primary,
              fontSize: theme.fontSize.large,
              paddingVertical: theme.spacing.base / 2,
              paddingLeft: theme.spacing.small * 2,
              fontFamily: "Circular-Book",
              maxHeight: 256,
              alignSelf: "center",
              flex: 1,
            }}
            onFocus={() => setFocused(true)}
            onBlur={blur}
            allowFontScaling={false}
            multiline
          />

          <Pressable
            onPress={press}
            style={({ pressed }) => [
              pressedDefault(pressed),
              {
                width: Device.deviceType === 1 ? 40 : 56,
                margin: theme.spacing.base / 2,
                borderWidth: focused && !props.generating && text.length ? 0 : theme.stroke,
                borderColor: !focused ? theme.color.secondary : theme.color.primary,
                backgroundColor: focused && !props.generating && text.length ? theme.color.primary : "transparent",
                borderRadius: 999,
                alignItems: "center",
                justifyContent: "center",
                aspectRatio: "1/1",
                alignSelf: "flex-end",
              },
            ]}
            hitSlop={8}
            disabled={!focused || props.generating || !text.length}
          >
            <ArrowUp
              color={
                !focused
                  ? theme.color.secondary
                  : props.generating || !text.length
                  ? theme.color.primary
                  : theme.color.inverted
              }
              size={theme.icon.large.size}
              absoluteStrokeWidth
              strokeWidth={theme.icon.large.stroke}
            />
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

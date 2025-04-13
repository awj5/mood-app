import { useEffect, useState, useRef } from "react";
import { StyleSheet, TextInput, View, Pressable, Keyboard, LayoutChangeEvent } from "react-native";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { ArrowUp } from "lucide-react-native";
import { MessageType } from "app/chat";
import Note from "./input/Note";
import { theme, pressedDefault } from "utils/helpers";

type InputProps = {
  generating: boolean;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  showInput: boolean;
  focusInput: boolean;
  setFocusInput: React.Dispatch<React.SetStateAction<boolean>>;
  keyboardShowing: boolean;
};

export default function Input(props: InputProps) {
  const colors = theme();
  const insets = useSafeAreaInsets();
  const marginBottom = useSharedValue(0);
  const inputRef = useRef<TextInput | null>(null);
  const inputShowingRef = useRef(false);
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const stroke = Device.deviceType !== 1 ? 2.5 : 2;
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const smallSpacing = Device.deviceType !== 1 ? 12 : 8;

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

  const onLayout = (event: LayoutChangeEvent) => {
    if (!props.showInput) marginBottom.value = 0 - event.nativeEvent.layout.height; // Hide on mount
  };

  useEffect(() => {
    if (props.showInput) {
      // Animate in
      marginBottom.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });

      const timer = setTimeout(() => {
        inputShowingRef.current = true;

        if (props.focusInput) {
          inputRef.current?.focus();
          props.setFocusInput(false); // Reset
        }
      }, 500); // Wait for input to finish animating

      return () => clearTimeout(timer);
    }
  }, [props.showInput]);

  useEffect(() => {
    if (inputShowingRef.current) {
      inputRef.current?.focus();
      props.setFocusInput(false); // Reset
    }
  }, [props.focusInput]);

  return (
    <Animated.View
      onLayout={onLayout}
      style={{
        padding: spacing,
        paddingBottom: props.keyboardShowing ? spacing : spacing + insets.bottom,
        gap: spacing,
        marginBottom,
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
          ref={inputRef}
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
              borderWidth: focused && !props.generating && text.length ? 0 : stroke,
              borderColor: !focused ? colors.secondary : colors.primary,
              backgroundColor: focused && !props.generating && text.length ? colors.primary : "transparent",
            },
          ]}
          hitSlop={8}
          disabled={!focused || props.generating || !text.length}
        >
          <ArrowUp
            color={
              !focused
                ? colors.secondary
                : props.generating || !text.length
                ? colors.primary
                : colors.primary === "white"
                ? "black"
                : "white"
            }
            size={Device.deviceType !== 1 ? 32 : 24}
            absoluteStrokeWidth
            strokeWidth={stroke}
          />
        </Pressable>
      </View>
    </Animated.View>
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

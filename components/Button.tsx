import { Pressable, Text, View, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { getTheme, pressedDefault } from "utils/helpers";

type ButtonProps = {
  children: string;
  func?: () => void;
  route?: string;
  fill?: boolean;
  large?: boolean;
  icon?: React.ElementType;
  disabled?: boolean;
  destructive?: boolean;
  gradient?: boolean;
  count?: number;
};

export default function Button(props: ButtonProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const Icon = props.icon;

  return (
    <Pressable
      onPress={() => (props.func ? props.func() : props.route && router.push(props.route))}
      style={({ pressed }) => [
        pressedDefault(pressed),
        {
          height: Device.deviceType === 1 ? (props.large ? 48 : 36) : props.large ? 64 : 48,
          borderWidth: props.destructive || props.fill || props.gradient ? 0 : theme.stroke,
          borderColor: theme.color.primary,
          backgroundColor: props.destructive
            ? theme.color.destructive
            : props.fill
            ? theme.color.primary
            : "transparent",
          borderRadius: 999,
          overflow: "hidden",
        },
        props.disabled && { opacity: 0.25 },
      ]}
      disabled={props.disabled}
      hitSlop={8}
    >
      {props.gradient && (
        <LinearGradient
          colors={theme.color.gradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
      )}

      <View
        style={{
          gap: theme.spacing.small / 2,
          paddingHorizontal: Device.deviceType === 1 ? (props.large ? 20 : 12) : props.large ? 24 : 16,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        {Icon && (
          <Icon
            color={
              props.destructive ? "white" : props.fill || props.gradient ? theme.color.inverted : theme.color.primary
            }
            size={theme.icon.base.size}
            absoluteStrokeWidth
            strokeWidth={theme.icon.base.stroke}
          />
        )}

        <Text
          style={{
            fontFamily: props.large ? "Circular-Bold" : "Circular-Medium",
            color: props.destructive
              ? "white"
              : props.fill || props.gradient
              ? theme.color.inverted
              : theme.color.primary,
            fontSize: theme.fontSize.body,
          }}
          allowFontScaling={false}
        >
          {props.children}
        </Text>

        {props.count ? (
          <View
            style={{
              backgroundColor: theme.color.primary,
              width: theme.icon.base.size,
              height: theme.icon.base.size,
              borderRadius: 999,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Circular-Book",
                color: theme.color.inverted,
                fontSize: theme.fontSize.small,
              }}
              allowFontScaling={false}
            >
              {props.count}
            </Text>
          </View>
        ) : (
          <></>
        )}
      </View>
    </Pressable>
  );
}

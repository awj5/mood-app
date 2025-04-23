import { StyleSheet, Pressable, Text, View } from "react-native";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { pressedDefault, theme } from "utils/helpers";

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
  const colors = theme();
  const router = useRouter();
  const Icon = props.icon;
  const iconSize = Device.deviceType !== 1 ? 28 : 20;

  return (
    <Pressable
      onPress={() => (props.func ? props.func() : props.route && router.push(props.route))}
      style={({ pressed }) => [
        pressedDefault(pressed),
        styles.container,
        {
          height: Device.deviceType !== 1 ? (props.fill || props.large ? 72 : 48) : props.fill || props.large ? 52 : 36,
          borderWidth: props.destructive || props.fill ? 0 : Device.deviceType !== 1 ? 2.5 : 2,
          borderColor: colors.primary,
          backgroundColor: props.destructive
            ? colors.destructive
            : props.fill && !props.gradient
            ? colors.primary
            : "transparent",
        },
        props.disabled && { opacity: 0.25 },
      ]}
      disabled={props.disabled}
      hitSlop={8}
    >
      {props.gradient && (
        <LinearGradient
          colors={colors.primary === "white" ? ["#FF8000", "#00FF00", "#0080FF"] : ["#0000FF", "#990099", "#FF0000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      )}

      <View
        style={[
          styles.wrapper,
          {
            gap: Device.deviceType !== 1 ? 10 : 6,
            paddingHorizontal:
              Device.deviceType !== 1 ? (props.fill || props.large ? 20 : 16) : props.fill || props.large ? 16 : 12,
          },
        ]}
      >
        {Icon && (
          <Icon
            color={!props.fill ? colors.primary : colors.primary === "white" ? "black" : "white"}
            size={iconSize}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
          />
        )}

        <Text
          style={{
            fontFamily: props.gradient ? "Circular-Bold" : "Circular-Medium",
            color: props.destructive
              ? "white"
              : !props.fill
              ? colors.primary
              : colors.primary === "white"
              ? "black"
              : "white",
            fontSize: Device.deviceType !== 1 ? 20 : 16,
          }}
          allowFontScaling={false}
        >
          {props.children}
        </Text>

        {props.count ? (
          <View
            style={[
              styles.count,
              {
                backgroundColor: colors.primary,
                width: iconSize,
                height: iconSize,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: "Circular-Book",
                color: colors.primary === "white" ? "black" : "white",
                fontSize: Device.deviceType !== 1 ? 18 : 14,
                lineHeight: Device.deviceType !== 1 ? 24 : 18,
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

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    overflow: "hidden",
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  gradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  count: {
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
});

import { StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CircleX } from "lucide-react-native";
import { pressedDefault } from "utils/helpers";

type CloseProps = {
  setShowTags: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStatement: React.Dispatch<React.SetStateAction<boolean>>;
  color: string;
};

export default function Close(props: CloseProps) {
  const insets = useSafeAreaInsets();

  const press = () => {
    props.setShowTags(false);
    props.setShowStatement(false);
  };

  return (
    <Pressable
      onPress={press}
      style={({ pressed }) => [
        pressedDefault(pressed),
        styles.container,
        {
          marginTop: insets.top,
          padding: Device.deviceType !== 1 ? 24 : 16,
        },
      ]}
      hitSlop={16}
    >
      <CircleX
        color={props.color}
        size={Device.deviceType !== 1 ? 40 : 32}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
});

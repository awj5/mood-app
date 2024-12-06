import { Modal, StyleSheet, View, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import { CircleX } from "lucide-react-native";
import { theme, pressedDefault } from "utils/helpers";

type NotiPromptProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NotiPrompt(props: NotiPromptProps) {
  const colors = theme();

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={styles.container}>
        <View
          style={[
            styles.wrapper,
            {
              width: Device.deviceType !== 1 ? 448 : 320,
              height: Device.deviceType !== 1 ? 384 : 288,
              backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.95)",
              borderRadius: Device.deviceType !== 1 ? 24 : 16,
            },
          ]}
        >
          <Pressable
            onPress={() => props.setVisible(false)}
            style={({ pressed }) => [
              pressedDefault(pressed),
              styles.close,
              {
                padding: Device.deviceType !== 1 ? 16 : 12,
              },
            ]}
            hitSlop={12}
          >
            <CircleX
              color={colors.primary}
              size={Device.deviceType !== 1 ? 32 : 24}
              absoluteStrokeWidth
              strokeWidth={Device.deviceType !== 1 ? 2.25 : 1.75}
            />
          </Pressable>

          <Text>Hello</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  close: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});

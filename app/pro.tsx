import { Pressable, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { theme, pressedDefault } from "utils/helpers";

export default function Pro() {
  const colors = theme();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          title: "",
          headerRight: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
              <Text
                style={{
                  fontFamily: "Circular-Book",
                  fontSize: Device.deviceType !== 1 ? 20 : 16,
                  color: colors.primary,
                }}
                allowFontScaling={false}
              >
                Close
              </Text>
            </Pressable>
          ),
        }}
      />
    </View>
  );
}

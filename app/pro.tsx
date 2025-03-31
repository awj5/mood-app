import { Pressable, Text, View, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { HeaderBackButton } from "@react-navigation/elements";
import BigButton from "components/BigButton";
import { theme, pressedDefault } from "utils/helpers";

export default function Pro() {
  const colors = theme();
  const router = useRouter();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          title: "",
          headerLeft:
            Platform.OS === "android"
              ? () => (
                  <HeaderBackButton
                    onPress={() => router.back()}
                    label="Back"
                    labelStyle={{ fontFamily: "Circular-Book", fontSize: Device.deviceType !== 1 ? 20 : 16 }}
                    tintColor={colors.primary}
                    allowFontScaling={false}
                    style={{ marginLeft: -8 }}
                  />
                )
              : () => null,
          headerRight:
            Platform.OS === "ios"
              ? () => (
                  <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => pressedDefault(pressed)}
                    hitSlop={16}
                  >
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
                )
              : () => null,
        }}
      />
      <View style={{ paddingHorizontal: spacing }}>
        <BigButton route="">Subscribe</BigButton>
      </View>
    </View>
  );
}

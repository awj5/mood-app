import { ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import Response from "components/chat/Response";
import Input from "components/chat/Input";
import { theme } from "utils/helpers";

export default function Chat() {
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const colors = theme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerTitle: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => router.dismissAll()}
              labelStyle={{ fontFamily: "Circular-Book" }}
              tintColor={colors.primary}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView>
          <Response />
        </ScrollView>

        <Input />
      </KeyboardAvoidingView>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

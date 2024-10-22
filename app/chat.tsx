import { StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import Response from "components/chat/Response";
import Input from "components/chat/Input";
import { theme } from "utils/helpers";

export default function Chat() {
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const colors = theme();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
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
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView>
          <Response />
        </ScrollView>

        <Input />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

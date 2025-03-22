import { StyleSheet, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Device from "expo-device";
import { HeaderBackButton } from "@react-navigation/elements";
import HeaderTitle from "components/HeaderTitle";
import { theme } from "utils/helpers";

export default function List() {
  const params = useLocalSearchParams<{ title: string }>();
  const colors = theme();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => router.dismissAll()}
              label="Back"
              labelStyle={{ fontFamily: "Circular-Book", fontSize: Device.deviceType !== 1 ? 20 : 16 }}
              tintColor={colors.primary}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
        }}
      />

      <HeaderTitle text={params.title} />
    </View>
  );
}

const styles = StyleSheet.create({
  //
});

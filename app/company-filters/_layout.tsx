import { Stack } from "expo-router";
import { theme } from "utils/helpers";

export default function Layout() {
  const colors = theme();

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: colors.primaryBg,
        },
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.primaryBg,
        },
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen name="list" />
    </Stack>
  );
}

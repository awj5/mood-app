import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { getTheme } from "utils/helpers";

export default function Layout() {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: theme.color.primaryBg,
        },
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.color.primaryBg,
        },
        headerTintColor: theme.color.primary,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="list" />
    </Stack>
  );
}

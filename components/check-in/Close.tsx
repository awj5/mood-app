import { Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CircleX } from "lucide-react-native";
import { getTheme, pressedDefault } from "utils/helpers";

type CloseProps = {
  setShowTags: React.Dispatch<React.SetStateAction<boolean>>;
  setShowStatement: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedTags: React.Dispatch<React.SetStateAction<number[]>>;
  foreground: string;
};

export default function Close(props: CloseProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  const press = () => {
    props.setSelectedTags([]); // Clear
    props.setShowTags(false);
    props.setShowStatement(false);
  };

  return (
    <Pressable
      onPress={press}
      style={({ pressed }) => [
        pressedDefault(pressed),
        {
          marginTop: insets.top,
          padding: theme.spacing.base,
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 1,
        },
      ]}
      hitSlop={16}
    >
      <CircleX
        color={props.foreground}
        size={theme.icon.xLarge.size}
        absoluteStrokeWidth
        strokeWidth={theme.icon.xLarge.stroke}
      />
    </Pressable>
  );
}

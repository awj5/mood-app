import { View, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { Sparkles, ChartSpline } from "lucide-react-native";
import { MessageType } from "app/chat";
import Button from "components/Button";
import { getTheme } from "utils/helpers";

type ButtonsProps = {
  message: MessageType;
  displayedText: string;
  showInput: boolean;
  setShowInput: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusInput: React.Dispatch<React.SetStateAction<boolean>>;
  company?: string;
  insightsSeen?: boolean;
};

export default function Buttons(props: ButtonsProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  const buttonClick = () => {
    if (props.message.button === "upsell") {
      router.push("pro");
    } else {
      router.dismissAll();
    }
  };

  const showAndFocusInput = () => {
    props.setShowInput(true);
    props.setFocusInput(true);
  };

  return (
    <Animated.View entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))} style={{ gap: theme.spacing.base }}>
      <View style={{ gap: theme.spacing.base, flexDirection: "row" }}>
        {props.message.button === "respond" && <Button func={showAndFocusInput}>Let's chat</Button>}

        <Button
          func={buttonClick}
          large={props.message.button === "upsell"}
          icon={
            props.message.button === "upsell" || (props.message.button !== "respond" && props.message.hasPro)
              ? Sparkles
              : undefined
          }
          gradient={props.message.button === "upsell"}
        >
          {props.message.button === "upsell"
            ? "Try Pro for FREE"
            : props.message.button === "respond"
            ? "Not right now"
            : "View my dashboard"}
        </Button>
      </View>

      {((props.company && !props.message.button && !props.displayedText.includes("?")) ||
        (props.company && props.message.button === "respond" && !props.insightsSeen)) && (
        <View style={{ alignSelf: "flex-start" }}>
          <Button route="company" icon={ChartSpline}>{`View ${props.company} insights`}</Button>
        </View>
      )}
    </Animated.View>
  );
}

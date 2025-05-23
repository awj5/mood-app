import { View, Text, Pressable, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { PurchasesPackage } from "react-native-purchases";
import { Circle, CircleCheck } from "lucide-react-native";
import { getTheme, pressedDefault } from "utils/helpers";

type ProductProps = {
  id: string;
  title: string;
  price: string;
  cycle: string;
  selected: boolean;
  setSelected: React.Dispatch<React.SetStateAction<PurchasesPackage | string | null | undefined>>;
};

export default function Product(props: ProductProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const Icon = props.selected ? CircleCheck : Circle;

  const press = () => {
    props.setSelected(props.id);
  };

  return (
    <Pressable
      onPress={press}
      style={({ pressed }) => [
        pressedDefault(pressed),
        {
          flex: 1,
        },
      ]}
      hitSlop={8}
      disabled={props.selected}
    >
      <View
        style={{
          borderWidth: theme.stroke,
          borderColor: theme.color.inverted,
          borderRadius: theme.spacing.base,
          padding: Device.deviceType === 1 ? theme.spacing.base : theme.spacing.base / 2,
          opacity: props.selected ? 1 : 0.5,
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View
          style={{
            gap: theme.spacing.small / 2,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Icon
            color={theme.color.inverted}
            size={theme.icon.base.size}
            absoluteStrokeWidth
            strokeWidth={theme.icon.base.stroke}
          />

          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: theme.color.inverted,
              fontSize: theme.fontSize.xSmall,
            }}
            allowFontScaling={false}
          >
            {props.title}
          </Text>
        </View>

        <View>
          {props.cycle === "year" && Device.deviceType === 1 && (
            <Text
              style={{
                fontFamily: "Circular-Book",
                color: theme.color.inverted,
                fontSize: theme.fontSize.xxSmall,
              }}
              allowFontScaling={false}
            >
              BEST VALUE
            </Text>
          )}

          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text
              style={{
                fontFamily: "Circular-Medium",
                color: theme.color.inverted,
                fontSize: theme.fontSize.large,
              }}
              allowFontScaling={false}
            >
              {props.price}
            </Text>

            <Text
              style={{
                fontFamily: "Circular-Book",
                color: theme.color.inverted,
                fontSize: theme.fontSize.small,
              }}
              allowFontScaling={false}
            >
              {` per ${props.cycle}`}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

import { useColorScheme, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import tagsData from "data/tags.json";
import Button from "components/Button";
import { getTheme } from "utils/helpers";

type FeelingsProps = {
  tags: number[];
};

export default function Feelings(props: FeelingsProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View>
      <ScrollView
        horizontal
        contentContainerStyle={{
          gap: theme.spacing.small,
          paddingHorizontal: theme.spacing.base,
        }}
        showsHorizontalScrollIndicator={false}
      >
        {props.tags.map((item) => (
          <Button key={item} deactivated>
            {tagsData.filter((tag) => tag.id === item)[0].name}
          </Button>
        ))}
      </ScrollView>
    </View>
  );
}

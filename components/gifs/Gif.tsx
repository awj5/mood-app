import { useState } from "react";
import { ActivityIndicator, Pressable, View, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { GifType } from "../Gifs";
import { pressedDefault, theme } from "utils/helpers";

type GifProps = {
  item: GifType;
};

export default function Gif(props: GifProps) {
  const colors = theme();
  const [loading, setLoading] = useState(true);

  return (
    <View style={{ aspectRatio: "1/1", height: Device.deviceType !== 1 ? 144 : 96 }}>
      <Pressable onPress={() => Linking.openURL(props.item.link)} style={({ pressed }) => pressedDefault(pressed)}>
        <Image
          source={{ uri: props.item.url }}
          style={[styles.image, { backgroundColor: colors.opaqueBg }]}
          onLoadEnd={() => setLoading(false)}
        />
      </Pressable>

      {loading && <ActivityIndicator color={colors.primary} style={[styles.image, { position: "absolute" }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

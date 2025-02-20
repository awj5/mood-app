import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { Share } from "lucide-react-native";
import QuotesData from "data/quotes.json";
import { CheckInMoodType, CheckInType } from "data/database";
import { theme, pressedDefault } from "utils/helpers";

type QuoteType = {
  quote: string;
  author: string;
  tags: number[];
};

type QuoteProps = {
  checkIns: CheckInType[];
};

export default function Quote(props: QuoteProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [quoteData, setQuoteData] = useState<QuoteType>();
  const [authorImage, setAuthorImage] = useState("");
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const images = {
    WilliamShakespeare: require("../../../assets/img/quotes/authors/william-shakespeare.jpg"),
    MarkTwain: require("../../../assets/img/quotes/authors/mark-twain.jpg"),
    MartinLutherKingJr: require("../../../assets/img/quotes/authors/martin-luther-king-jr.jpg"),
    BenjaminFranklin: require("../../../assets/img/quotes/authors/benjamin-franklin.jpg"),
    HelenKeller: require("../../../assets/img/quotes/authors/helen-keller.jpg"),
    Aristotle: require("../../../assets/img/quotes/authors/aristotle.jpg"),
    VincentVanGogh: require("../../../assets/img/quotes/authors/vincent-van-gogh.jpg"),
    JohnLubbock: require("../../../assets/img/quotes/authors/john-lubbock.jpg"),
    CharlotteBrontë: require("../../../assets/img/quotes/authors/charlotte-bronte.jpg"),
    YogiBerra: require("../../../assets/img/quotes/authors/yogi-berra.jpg"),
    LouHoltz: require("../../../assets/img/quotes/authors/lou-holtz.jpg"),
    EckhartTolle: require("../../../assets/img/quotes/authors/eckhart-tolle.jpg"),
    WilliamJames: require("../../../assets/img/quotes/authors/william-james.jpg"),
    DaleCarnegie: require("../../../assets/img/quotes/authors/dale-carnegie.jpg"),
    BertrandRussell: require("../../../assets/img/quotes/authors/bertrand-russell.jpg"),
    AudreyHepburn: require("../../../assets/img/quotes/authors/audrey-hepburn.jpg"),
    HarveyMackay: require("../../../assets/img/quotes/authors/harvey-mackay.jpg"),
    LaoTzu: require("../../../assets/img/quotes/authors/lao-tzu.jpg"),
    PauloCoelho: require("../../../assets/img/quotes/authors/paulo-coelho.jpg"),
    LuciusAnnaeusSeneca: require("../../../assets/img/quotes/authors/lucius-annaeus-seneca.jpg"),
    Socrates: require("../../../assets/img/quotes/authors/socrates.jpg"),
    GeorgeEliot: require("../../../assets/img/quotes/authors/george-eliot.jpg"),
    BrendonBurchard: require("../../../assets/img/quotes/authors/brendon-burchard.jpg"),
    CharlesDickens: require("../../../assets/img/quotes/authors/charles-dickens.jpg"),
    Confucius: require("../../../assets/img/quotes/authors/confucius.jpg"),
    DalaiLama: require("../../../assets/img/quotes/authors/dalai-lama.jpg"),
    RolloMay: require("../../../assets/img/quotes/authors/rollo-may.jpg"),
    BrianTracy: require("../../../assets/img/quotes/authors/brian-tracy.jpg"),
    KhalilGibran: require("../../../assets/img/quotes/authors/khalil-gibran.jpg"),
    RalphWaldoEmerson: require("../../../assets/img/quotes/authors/ralph-waldo-emerson.jpg"),
    MarcusAurelius: require("../../../assets/img/quotes/authors/marcus-aurelius.jpg"),
    HenryFord: require("../../../assets/img/quotes/authors/henry-ford.jpg"),
    WarrenBuffett: require("../../../assets/img/quotes/authors/warren-buffett.jpg"),
    CarlJung: require("../../../assets/img/quotes/authors/carl-jung.jpg"),
    PemaChödrön: require("../../../assets/img/quotes/authors/pema-chodron.jpg"),
    JosephCampbell: require("../../../assets/img/quotes/authors/joseph-campbell.jpg"),
    NelsonMandela: require("../../../assets/img/quotes/authors/nelson-mandela.jpg"),
    MahatmaGandhi: require("../../../assets/img/quotes/authors/mahatma-gandhi.jpg"),
    AbrahamLincoln: require("../../../assets/img/quotes/authors/abraham-lincoln.jpg"),
    PlinytheElder: require("../../../assets/img/quotes/authors/pliny-the-elder.jpg"),
    ThomasCarlyle: require("../../../assets/img/quotes/authors/thomas-carlyle.jpg"),
    Buddha: require("../../../assets/img/quotes/authors/buddha.jpg"),
    AudreLorde: require("../../../assets/img/quotes/authors/audre-lorde.jpg"),
    BeyoncéKnowles: require("../../../assets/img/quotes/authors/beyonce-knowles.jpg"),
    AlbertEinstein: require("../../../assets/img/quotes/authors/albert-einstein.jpg"),
    OprahWinfrey: require("../../../assets/img/quotes/authors/oprah-winfrey.jpg"),
    BruceLee: require("../../../assets/img/quotes/authors/bruce-lee.jpg"),
    Epictetus: require("../../../assets/img/quotes/authors/epictetus.jpg"),
    ThomasEdison: require("../../../assets/img/quotes/authors/thomas-edison.jpg"),
    JaggiVasudev: require("../../../assets/img/quotes/authors/jaggi-vasudev.jpg"),
    ThomasJefferson: require("../../../assets/img/quotes/authors/thomas-jefferson.jpg"),
    AlbertCamus: require("../../../assets/img/quotes/authors/albert-camus.jpg"),
    FriedrichNietzsche: require("../../../assets/img/quotes/authors/friedrich-nietzsche.jpg"),
    MicheldeMontaigne: require("../../../assets/img/quotes/authors/michel-de-montaigne.jpg"),
  };

  useEffect(() => {
    const mood: CheckInMoodType = JSON.parse(props.checkIns[props.checkIns.length - 1].mood); // Latest check-in
    const tags = mood.tags;
    const quotes = QuotesData.filter((item) => item.tags.includes(tags[Math.floor(Math.random() * tags.length)])); // Quotes with random tag

    if (quotes.length) {
      const random = quotes[Math.floor(Math.random() * quotes.length)]; // Random quote
      setQuoteData(random);

      // Check if author image exists
      const image = images[random.author.replace(/ /g, "").replace(/\./g, "") as keyof typeof images];
      setAuthorImage(image ? image : "");
    }

    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, []);

  return (
    <Animated.View
      style={{
        width: "100%",
        backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
        borderRadius: spacing,
        padding: spacing,
        gap: spacing,
        opacity,
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 16 : 12,
          }}
          allowFontScaling={false}
        >
          WORDS OF WISDOM
        </Text>

        <Pressable
          onPress={() => alert("Coming soon")}
          style={({ pressed }) => [
            pressedDefault(pressed),
            styles.share,
            { margin: Device.deviceType !== 1 ? -2 : -1.5 },
          ]}
          hitSlop={16}
        >
          <Share
            color={colors.primary}
            size={Device.deviceType !== 1 ? 28 : 20}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
          />
        </Pressable>
      </View>

      <View style={{ gap: spacing / 2 }}>
        <Text
          style={{
            fontFamily: "Tiempos-RegularItalic",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 20 : 16,
            lineHeight: Device.deviceType !== 1 ? 28 : 20,
          }}
          allowFontScaling={false}
        >
          “{quoteData?.quote}”
        </Text>

        <View style={[styles.author, { gap: spacing / 2 }]}>
          <Image
            source={authorImage}
            style={[styles.image, { width: Device.deviceType !== 1 ? 44 : 32, display: authorImage ? "flex" : "none" }]}
          />

          <Text
            style={{
              fontFamily: "Circular-Medium",
              color: colors.primary,
              fontSize: Device.deviceType !== 1 ? 18 : 14,
            }}
            allowFontScaling={false}
          >
            {`${!authorImage ? "— " : ""}${quoteData?.author}`}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  share: {
    position: "absolute",
    right: 0,
  },
  author: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  image: {
    aspectRatio: "1/1",
    borderRadius: 999,
  },
});

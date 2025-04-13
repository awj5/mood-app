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
  const url = "https://www.mood.ai/img/quotes/authors/";

  const images = {
    WilliamShakespeare: "william-shakespeare.jpg",
    MarkTwain: "mark-twain.jpg",
    MartinLutherKingJr: "martin-luther-king-jr.jpg",
    BenjaminFranklin: "benjamin-franklin.jpg",
    HelenKeller: "helen-keller.jpg",
    Aristotle: "aristotle.jpg",
    VincentVanGogh: "vincent-van-gogh.jpg",
    JohnLubbock: "john-lubbock.jpg",
    CharlotteBrontë: "charlotte-bronte.jpg",
    YogiBerra: "yogi-berra.jpg",
    LouHoltz: "lou-holtz.jpg",
    EckhartTolle: "eckhart-tolle.jpg",
    WilliamJames: "william-james.jpg",
    DaleCarnegie: "dale-carnegie.jpg",
    BertrandRussell: "bertrand-russell.jpg",
    AudreyHepburn: "audrey-hepburn.jpg",
    HarveyMackay: "harvey-mackay.jpg",
    LaoTzu: "lao-tzu.jpg",
    PauloCoelho: "paulo-coelho.jpg",
    LuciusAnnaeusSeneca: "lucius-annaeus-seneca.jpg",
    Socrates: "socrates.jpg",
    GeorgeEliot: "george-eliot.jpg",
    BrendonBurchard: "brendon-burchard.jpg",
    CharlesDickens: "charles-dickens.jpg",
    Confucius: "confucius.jpg",
    DalaiLama: "dalai-lama.jpg",
    RolloMay: "rollo-may.jpg",
    BrianTracy: "brian-tracy.jpg",
    KhalilGibran: "khalil-gibran.jpg",
    RalphWaldoEmerson: "ralph-waldo-emerson.jpg",
    MarcusAurelius: "marcus-aurelius.jpg",
    HenryFord: "henry-ford.jpg",
    WarrenBuffett: "warren-buffett.jpg",
    CarlJung: "carl-jung.jpg",
    PemaChödrön: "pema-chodron.jpg",
    JosephCampbell: "joseph-campbell.jpg",
    NelsonMandela: "nelson-mandela.jpg",
    MahatmaGandhi: "mahatma-gandhi.jpg",
    AbrahamLincoln: "abraham-lincoln.jpg",
    PlinytheElder: "pliny-the-elder.jpg",
    ThomasCarlyle: "thomas-carlyle.jpg",
    Buddha: "buddha.jpg",
    AudreLorde: "audre-lorde.jpg",
    BeyoncéKnowles: "beyonce-knowles.jpg",
    AlbertEinstein: "albert-einstein.jpg",
    OprahWinfrey: "oprah-winfrey.jpg",
    BruceLee: "bruce-lee.jpg",
    Epictetus: "epictetus.jpg",
    ThomasEdison: "thomas-edison.jpg",
    JaggiVasudev: "jaggi-vasudev.jpg",
    ThomasJefferson: "thomas-jefferson.jpg",
    AlbertCamus: "albert-camus.jpg",
    FriedrichNietzsche: "friedrich-nietzsche.jpg",
    MicheldeMontaigne: "michel-de-montaigne.jpg",
    WinstonChurchill: "winston-churchill.jpg",
    WaltWhitman: "walt-whitman.jpg",
    WayneDyer: "wayne-dyer.jpg",
    BrenéBrown: "brene-brown.jpg",
    MotherTeresa: "mother-teresa.jpg",
    MaxwellMaltz: "maxwell-maltz.jpg",
    ClareBootheLuce: "clare-boothe-luce.jpg",
    JimRohn: "jim-rohn.jpg",
    EleanorRoosevelt: "eleanor-roosevelt.jpg",
    HenryDavidThoreau: "henry-david-thoreau.jpg",
    AdamGrant: "adam-grant.jpg",
    StephenKing: "stephen-king.jpg",
    Sophocles: "sophocles.jpg",
    DouglasAdams: "douglas-adams.jpg",
    LeonardodaVinci: "leonardo-da-vinci.jpg",
    StephenCovey: "stephen-covey.jpg",
    NeilGaiman: "neil-gaiman.jpg",
    TonyRobbins: "tony-robbins.jpg",
    CSLewis: "cs-lewis.jpg",
    Ovid: "ovid.jpg",
    ErnestHemingway: "ernest-hemingway.jpg",
    FScottFitzgerald: "f-scott-fitzgerald.jpg",
    FranklinDRoosevelt: "franklin-d-roosevelt.jpg",
    FrançoisdeLaRochefoucauld: "francois-de-la-rochefoucauld.jpg",
    ThichNhatHanh: "thich-nhat-hanh.jpg",
    MayaAngelou: "maya-angelou.jpg",
    RonaldReagan: "ronald-reagan.jpg",
  };

  useEffect(() => {
    const mood: CheckInMoodType = JSON.parse(props.checkIns[props.checkIns.length - 1].mood); // Latest check-in
    const tags = mood.tags;
    const randTag = tags[Math.floor(Math.random() * tags.length)];
    const quotes = QuotesData.filter((item) => item.tags.includes(randTag)); // Quotes with random tag

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
        backgroundColor: colors.opaqueBg,
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

        <View style={[styles.author, { gap: Device.deviceType !== 1 ? 10 : 6 }]}>
          <Image
            source={{ uri: url + authorImage }}
            style={[
              styles.image,
              {
                width: Device.deviceType !== 1 ? 44 : 32,
                display: authorImage ? "flex" : "none",
                backgroundColor: colors.opaqueBg,
              },
            ]}
          />

          <Text
            style={{
              fontFamily: "Circular-Book",
              color: colors.primary,
              fontSize: Device.deviceType !== 1 ? 18 : 14,
            }}
            allowFontScaling={false}
          >
            {`${!authorImage ? "\u2014 " : ""}${quoteData?.author}`}
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

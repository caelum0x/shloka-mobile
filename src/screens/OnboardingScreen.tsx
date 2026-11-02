import React, { useState } from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../lib/theme";

const { width: SCREEN_W } = Dimensions.get("window");

interface Slide {
  icon: React.ComponentProps<typeof Feather>["name"];
  line: string;
}

const SLIDES: Slide[] = [
  { icon: "book-open", line: "One verse at a time" },
  { icon: "heart", line: "Keep what moves you" },
  { icon: "edit-3", line: "Write a private note" },
  { icon: "image", line: "Share it as a card" },
];

interface OnboardingScreenProps {
  onDone: () => void;
}

export function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: SCREEN_W }]}>
            <Text style={styles.glyph}>ॐ</Text>
            <View style={styles.iconWrap}>
              <Feather name={item.icon} size={30} color={theme.accent} />
            </View>
            <Text style={styles.line}>{item.line}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index ? styles.dotActive : null]} />
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.primaryBtn}
          accessibilityLabel={isLast ? "Begin" : "Next"}
          onPress={() => {
            if (isLast) onDone();
            else setIndex((i) => Math.min(i + 1, SLIDES.length - 1));
          }}
        >
          <Feather
            name={isLast ? "check" : "arrow-right"}
            size={24}
            color={theme.bg}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  glyph: {
    position: "absolute",
    top: "18%",
    fontSize: 54,
    color: theme.accent,
    opacity: 0.9,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: theme.glass,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  line: {
    color: theme.fg,
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  dots: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
    marginBottom: 28,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.glassBorder,
  },
  dotActive: {
    backgroundColor: theme.accent,
    width: 18,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 36,
  },
  primaryBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});

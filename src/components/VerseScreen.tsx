import React from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { theme } from "../lib/theme";
import type { Verse } from "../lib/types";
import { ActionRail } from "./ActionRail";

const { height: SCREEN_H } = Dimensions.get("window");

interface VerseScreenProps {
  verse: Verse;
  liked: boolean;
  hasNote: boolean;
  onOpenDetail: () => void;
  onLike: () => void;
  onNote: () => void;
  onShare: () => void;
  onCard: () => void;
}

export function VerseScreen({
  verse,
  liked,
  hasNote,
  onOpenDetail,
  onLike,
  onNote,
  onShare,
  onCard,
}: VerseScreenProps) {
  return (
    <View style={[styles.screen, { height: SCREEN_H }]}>
      <Pressable style={styles.tapArea} onPress={onOpenDetail}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          <Text style={styles.tag}>
            {verse.chapterTitle.toUpperCase()} · {verse.chapter}.{verse.verse}
          </Text>
          <Text style={styles.sanskrit}>{verse.sanskrit}</Text>
          <View style={styles.divider} />
          <Text style={styles.translation} numberOfLines={8}>
            {verse.translation}
          </Text>
        </ScrollView>
      </Pressable>
      <ActionRail
        liked={liked}
        hasNote={hasNote}
        onLike={onLike}
        onNote={onNote}
        onShare={onShare}
        onCard={onCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: "100%",
    backgroundColor: theme.bg,
    justifyContent: "center",
  },
  tapArea: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 28,
    paddingRight: 86,
    justifyContent: "center",
    minHeight: "100%",
  },
  tag: {
    color: theme.accent,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.2,
    marginBottom: 22,
  },
  sanskrit: {
    color: theme.fg,
    fontSize: 26,
    lineHeight: 40,
    marginBottom: 26,
  },
  divider: {
    width: 42,
    height: 2,
    backgroundColor: theme.accentDim,
    marginBottom: 26,
  },
  translation: {
    color: theme.fg,
    fontSize: 18,
    lineHeight: 27,
    fontStyle: "italic",
  },
});

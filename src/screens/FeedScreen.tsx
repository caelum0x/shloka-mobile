import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { theme } from "../lib/theme";
import { verses } from "../lib/data";
import { useLibrary } from "../lib/LibraryContext";
import { VerseScreen } from "../components/VerseScreen";
import { DetailSheet } from "../components/DetailSheet";
import { ShareCardModal } from "../components/ShareCardModal";
import type { Verse } from "../lib/types";

const { height: SCREEN_H } = Dimensions.get("window");

export function FeedScreen({ startIndex }: { startIndex: number }) {
  const { isLiked, toggleLike, notes, setNote, recordPosition, textScale, cycleTextScale } =
    useLibrary();
  const [activeVerse, setActiveVerse] = useState<Verse | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [cardVerse, setCardVerse] = useState<Verse | null>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const listRef = useRef<FlatList<Verse>>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index?: number | null }> }) => {
      const first = viewableItems[0];
      if (first && typeof first.index === "number") {
        recordPosition(first.index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const openDetail = useCallback((verse: Verse) => {
    setActiveVerse(verse);
    setDetailVisible(true);
  }, []);

  const shareVerse = useCallback(async (verse: Verse) => {
    try {
      await Share.share({
        message: `${verse.translation}\n\n— Bhagavad Gita ${verse.chapter}.${verse.verse}`,
      });
    } catch {
      // User cancelled or share failed silently; nothing to recover.
    }
  }, []);

  const openCard = useCallback((verse: Verse) => {
    setCardVerse(verse);
    setCardVisible(true);
  }, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: SCREEN_H,
      offset: SCREEN_H * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <FlatList
        ref={listRef}
        data={verses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VerseScreen
            verse={item}
            liked={isLiked(item.id)}
            hasNote={Boolean(notes[item.id]?.trim())}
            textScale={textScale}
            onOpenDetail={() => openDetail(item)}
            onLike={() => toggleLike(item.id)}
            onNote={() => openDetail(item)}
            onShare={() => shareVerse(item)}
            onCard={() => openCard(item)}
            onCycleTextScale={cycleTextScale}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_H}
        decelerationRate={Platform.OS === "ios" ? 0.992 : "fast"}
        getItemLayout={getItemLayout}
        initialScrollIndex={startIndex > 0 ? startIndex : undefined}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        windowSize={5}
        maxToRenderPerBatch={4}
        removeClippedSubviews
      />

      <DetailSheet
        verse={activeVerse}
        note={activeVerse ? notes[activeVerse.id] ?? "" : ""}
        visible={detailVisible}
        textScale={textScale}
        onClose={() => setDetailVisible(false)}
        onChangeNote={(text) => {
          if (activeVerse) setNote(activeVerse.id, text);
        }}
      />

      <ShareCardModal
        verse={cardVerse}
        visible={cardVisible}
        onClose={() => setCardVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.bg,
  },
});

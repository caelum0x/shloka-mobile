import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { theme } from "../lib/theme";
import type { Verse } from "../lib/types";

interface DetailSheetProps {
  verse: Verse | null;
  note: string;
  visible: boolean;
  focusNote?: boolean;
  textScale: number;
  onClose: () => void;
  onChangeNote: (text: string) => void;
}

export function DetailSheet({
  verse,
  note,
  visible,
  focusNote,
  textScale,
  onClose,
  onChangeNote,
}: DetailSheetProps) {
  const [draft, setDraft] = useState(note);

  useEffect(() => {
    setDraft(note);
  }, [verse?.id, note]);

  if (!verse) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            <View style={styles.grabber} />
            <View style={styles.headerRow}>
              <Text style={styles.chapterTitle}>{verse.chapterTitle}</Text>
              <Pressable
                onPress={onClose}
                accessibilityLabel="Close"
                hitSlop={12}
              >
                <Feather name="x" size={22} color={theme.fgDim} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.chapterSanskritName}>
                {verse.chapterSanskritName} · {verse.chapter}.{verse.verse}
              </Text>
              <Text style={styles.sectionLabel}>CHAPTER CONTEXT</Text>
              <Text style={styles.body}>{verse.chapterSummary}</Text>

              <Text style={styles.sectionLabel}>SANSKRIT</Text>
              <Text
                style={[
                  styles.sanskrit,
                  { fontSize: 18 * textScale, lineHeight: 28 * textScale },
                ]}
              >
                {verse.sanskrit}
              </Text>

              <Text style={styles.sectionLabel}>TRANSLATION</Text>
              <Text
                style={[
                  styles.body,
                  { fontSize: 15 * textScale, lineHeight: 22 * textScale },
                ]}
              >
                {verse.translation}
              </Text>

              <Text style={styles.sectionLabel}>YOUR NOTE</Text>
              <TextInput
                style={styles.noteInput}
                multiline
                autoFocus={focusNote}
                placeholder="A private reflection, kept on this phone"
                placeholderTextColor={theme.fgDim}
                value={draft}
                onChangeText={(text) => {
                  setDraft(text);
                  onChangeNote(text);
                }}
              />
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheetWrap: {
    maxHeight: "86%",
  },
  sheet: {
    backgroundColor: theme.bgElevated,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 18,
  },
  grabber: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.glassBorder,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chapterTitle: {
    color: theme.fg,
    fontSize: 18,
    fontWeight: "600",
    flexShrink: 1,
    paddingRight: 12,
  },
  chapterSanskritName: {
    color: theme.fgDim,
    fontSize: 13,
    marginBottom: 18,
  },
  sectionLabel: {
    color: theme.accent,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 18,
  },
  body: {
    color: theme.fg,
    fontSize: 15,
    lineHeight: 22,
  },
  sanskrit: {
    color: theme.fg,
    fontSize: 18,
    lineHeight: 28,
  },
  noteInput: {
    color: theme.fg,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: theme.glass,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    borderRadius: 12,
    padding: 14,
  },
});

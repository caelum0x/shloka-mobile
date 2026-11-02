import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";
import { theme } from "../lib/theme";
import type { Verse } from "../lib/types";

interface ShareCardModalProps {
  verse: Verse | null;
  visible: boolean;
  onClose: () => void;
}

const CARD_W = 300;
const CARD_H = 375;
const EXPORT_W = 1080;
const EXPORT_H = 1350;

export function ShareCardModal({ verse, visible, onClose }: ShareCardModalProps) {
  const cardRef = useRef<React.ComponentRef<typeof View>>(null);
  const [sharing, setSharing] = useState(false);

  if (!verse) return null;

  async function handleShare() {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const uri = await captureRef(cardRef.current, {
        format: "png",
        quality: 1,
        width: EXPORT_W,
        height: EXPORT_H,
        result: "tmpfile",
      });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Share verse card",
        });
      }
    } catch {
      // Silent: user can retry; no crash-worthy state to recover.
    } finally {
      setSharing(false);
    }
  }

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.cardWrap}>
          <View ref={cardRef} collapsable={false} style={styles.card}>
            <View style={styles.glowTop} />
            <View style={styles.glowBottom} />
            <Text style={styles.tag}>
              {verse.chapterTitle.toUpperCase()} · {verse.chapter}.{verse.verse}
            </Text>
            <Text style={styles.sanskrit} numberOfLines={6}>
              {verse.sanskrit}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.translation} numberOfLines={8}>
              “{verse.translation}”
            </Text>
            <View style={styles.footer}>
              <View style={styles.footerLine} />
              <View style={styles.footerRow}>
                <Text style={styles.footerMark}>ॐ</Text>
                <Text style={styles.footerName}>Shloka</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={styles.actionBtn}
            onPress={onClose}
            accessibilityLabel="Close"
          >
            <Feather name="x" size={22} color={theme.fg} />
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            onPress={handleShare}
            accessibilityLabel="Share card"
            disabled={sharing}
          >
            {sharing ? (
              <ActivityIndicator color={theme.bg} />
            ) : (
              <Feather name="share" size={22} color={theme.bg} />
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrap: {
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    backgroundColor: theme.bg,
    borderRadius: 18,
    padding: 26,
    overflow: "hidden",
  },
  glowTop: {
    position: "absolute",
    top: -60,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.accent,
    opacity: 0.12,
  },
  glowBottom: {
    position: "absolute",
    bottom: -70,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: theme.accent,
    opacity: 0.08,
  },
  tag: {
    color: theme.accent,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 16,
  },
  sanskrit: {
    color: theme.fg,
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 16,
  },
  divider: {
    width: 32,
    height: 2,
    backgroundColor: theme.accentDim,
    marginBottom: 16,
  },
  translation: {
    color: theme.fg,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    left: 26,
    right: 26,
    bottom: 22,
  },
  footerLine: {
    height: 1,
    backgroundColor: "rgba(201,162,74,0.25)",
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerMark: {
    color: theme.accent,
    fontSize: 15,
    fontWeight: "700",
  },
  footerName: {
    color: theme.fgDim,
    fontSize: 12,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 28,
  },
  actionBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.glass,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnPrimary: {
    backgroundColor: theme.accent,
    borderColor: theme.accent,
  },
});

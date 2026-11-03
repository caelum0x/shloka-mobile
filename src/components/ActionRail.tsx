import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { theme } from "../lib/theme";

interface ActionRailProps {
  liked: boolean;
  hasNote: boolean;
  textScalePercent: number;
  onLike: () => void;
  onNote: () => void;
  onShare: () => void;
  onCard: () => void;
  onCycleTextScale: () => void;
}

function RailButton({
  name,
  active,
  onPress,
  label,
}: {
  name: React.ComponentProps<typeof Feather>["name"];
  active?: boolean;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        active ? styles.buttonActive : null,
        pressed ? styles.buttonPressed : null,
      ]}
      hitSlop={10}
    >
      <Feather
        name={name}
        size={22}
        color={active ? theme.accent : theme.fg}
      />
    </Pressable>
  );
}

export function ActionRail({
  liked,
  hasNote,
  textScalePercent,
  onLike,
  onNote,
  onShare,
  onCard,
  onCycleTextScale,
}: ActionRailProps) {
  return (
    <View style={styles.rail} pointerEvents="box-none">
      <RailButton
        name="heart"
        active={liked}
        onPress={onLike}
        label={liked ? "Unlike verse" : "Like verse"}
      />
      <RailButton
        name="edit-3"
        active={hasNote}
        onPress={onNote}
        label={hasNote ? "Edit note" : "Add note"}
      />
      <RailButton name="image" onPress={onCard} label="Make a verse card" />
      <RailButton name="share" onPress={onShare} label="Share verse" />
      <RailButton
        name="type"
        active={textScalePercent !== 100}
        onPress={onCycleTextScale}
        label={`Text size, ${textScalePercent} percent, tap to change`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    position: "absolute",
    right: 14,
    bottom: 160,
    alignItems: "center",
    gap: 16,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.glass,
    borderWidth: 1,
    borderColor: theme.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    borderColor: theme.accent,
  },
  buttonPressed: {
    opacity: 0.6,
  },
});

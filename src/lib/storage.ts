import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_TEXT_SCALE, nearestTextScale } from "./textScale";

const KEYS = {
  likes: "shloka:likes",
  notes: "shloka:notes",
  lastIndex: "shloka:lastIndex",
  onboarded: "shloka:onboarded",
  textScale: "shloka:textScale",
};

export async function loadLikes(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.likes);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export async function saveLikes(likes: Set<string>): Promise<boolean> {
  try {
    await AsyncStorage.setItem(KEYS.likes, JSON.stringify([...likes]));
    return true;
  } catch {
    return false;
  }
}

export async function loadNotes(): Promise<Record<string, string>> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.notes);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export async function saveNotes(notes: Record<string, string>): Promise<boolean> {
  try {
    await AsyncStorage.setItem(KEYS.notes, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}

export async function loadLastIndex(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.lastIndex);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export async function saveLastIndex(index: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.lastIndex, String(index));
  } catch {
    // Best-effort background save; not user-initiated, no feedback needed.
  }
}

export async function loadOnboarded(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEYS.onboarded)) === "1";
  } catch {
    return false;
  }
}

export async function saveOnboarded(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.onboarded, "1");
  } catch {
    // Non-critical.
  }
}

export async function loadTextScale(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.textScale);
    if (!raw) return DEFAULT_TEXT_SCALE;
    return nearestTextScale(Number(raw));
  } catch {
    return DEFAULT_TEXT_SCALE;
  }
}

export async function saveTextScale(scale: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.textScale, String(scale));
  } catch {
    // Non-critical; falls back to default next launch.
  }
}

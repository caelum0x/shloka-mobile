import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  loadLastIndex,
  loadLikes,
  loadNotes,
  loadTextScale,
  saveLastIndex,
  saveLikes,
  saveNotes,
  saveTextScale,
} from "./storage";
import { DEFAULT_TEXT_SCALE, nextTextScale } from "./textScale";

interface LibraryState {
  ready: boolean;
  likes: Set<string>;
  notes: Record<string, string>;
  lastIndex: number;
  textScale: number;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  setNote: (id: string, text: string) => void;
  removeNote: (id: string) => void;
  recordPosition: (index: number) => void;
  cycleTextScale: () => void;
}

const LibraryContext = createContext<LibraryState | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [lastIndex, setLastIndex] = useState(0);
  const [textScale, setTextScale] = useState(DEFAULT_TEXT_SCALE);
  const positionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const [l, n, idx, scale] = await Promise.all([
        loadLikes(),
        loadNotes(),
        loadLastIndex(),
        loadTextScale(),
      ]);
      setLikes(l);
      setNotes(n);
      setLastIndex(idx);
      setTextScale(scale);
      setReady(true);
    })();
  }, []);

  const toggleLike = useCallback((id: string) => {
    setLikes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveLikes(next);
      return next;
    });
  }, []);

  const isLiked = useCallback((id: string) => likes.has(id), [likes]);

  const setNote = useCallback((id: string, text: string) => {
    setNotes((prev) => {
      const next = { ...prev, [id]: text };
      if (!text.trim()) delete next[id];
      saveNotes(next);
      return next;
    });
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = { ...prev };
      delete next[id];
      saveNotes(next);
      return next;
    });
  }, []);

  const recordPosition = useCallback((index: number) => {
    setLastIndex(index);
    if (positionTimer.current) clearTimeout(positionTimer.current);
    positionTimer.current = setTimeout(() => {
      saveLastIndex(index);
    }, 400);
  }, []);

  const cycleTextScale = useCallback(() => {
    setTextScale((prev) => {
      const next = nextTextScale(prev);
      saveTextScale(next);
      return next;
    });
  }, []);

  return (
    <LibraryContext.Provider
      value={{
        ready,
        likes,
        notes,
        lastIndex,
        textScale,
        toggleLike,
        isLiked,
        setNote,
        removeNote,
        recordPosition,
        cycleTextScale,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryState {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
}

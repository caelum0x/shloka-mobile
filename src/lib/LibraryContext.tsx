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
  saveLastIndex,
  saveLikes,
  saveNotes,
} from "./storage";

interface LibraryState {
  ready: boolean;
  likes: Set<string>;
  notes: Record<string, string>;
  lastIndex: number;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  setNote: (id: string, text: string) => void;
  removeNote: (id: string) => void;
  recordPosition: (index: number) => void;
}

const LibraryContext = createContext<LibraryState | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [lastIndex, setLastIndex] = useState(0);
  const positionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const [l, n, idx] = await Promise.all([
        loadLikes(),
        loadNotes(),
        loadLastIndex(),
      ]);
      setLikes(l);
      setNotes(n);
      setLastIndex(idx);
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

  return (
    <LibraryContext.Provider
      value={{
        ready,
        likes,
        notes,
        lastIndex,
        toggleLike,
        isLiked,
        setNote,
        removeNote,
        recordPosition,
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

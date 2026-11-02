import versesRaw from "../data/gita.json";
import chaptersRaw from "../data/chapters.json";
import type { Chapter, Verse } from "./types";

export const verses: Verse[] = versesRaw as Verse[];
export const chapters: Chapter[] = chaptersRaw as Chapter[];

export function verseIndexById(id: string): number {
  return verses.findIndex((v) => v.id === id);
}

export function chapterFirstVerseIndex(chapterNumber: number): number {
  return verses.findIndex((v) => v.chapter === chapterNumber);
}

export function searchVerses(query: string, limit = 40): Verse[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const out: Verse[] = [];
  for (const v of verses) {
    if (
      v.translation.toLowerCase().includes(q) ||
      v.sanskrit.includes(query.trim()) ||
      v.chapterTitle.toLowerCase().includes(q) ||
      v.chapterSanskritName.toLowerCase().includes(q)
    ) {
      out.push(v);
      if (out.length >= limit) break;
    }
  }
  return out;
}

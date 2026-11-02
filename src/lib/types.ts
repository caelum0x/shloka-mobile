export interface Verse {
  id: string;
  chapter: number;
  verse: number;
  chapterTitle: string;
  chapterSanskritName: string;
  chapterSummary: string;
  sanskrit: string;
  translation: string;
}

export interface Chapter {
  chapter: number;
  sanskrit_name: string;
  title: string;
  summary: string;
}

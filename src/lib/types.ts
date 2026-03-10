// ─── Frontend Dua type ───────────────────────────────────────────────────────

export interface Dua {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  context: string;
  audioUrl?: string;
}

// ─── API response types ─────────────────────────────────────────────────────

export interface ApiDua {
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  context: string;
}

export interface ApiDuaData {
  message: string;
  duas: ApiDua[];
  advice: string;
}

export interface GenerateDuaApiResponse {
  statusCode: number;
  error: string | null;
  message: string;
  data: ApiDuaData | null;
}

// ─── Bookmark types ─────────────────────────────────────────────────────────

export interface BookmarkItem {
  dua: Dua;
  addedAt: number;
  note?: string;
}

// ─── Search history ─────────────────────────────────────────────────────────

export interface SearchResult {
  query: string;
  results: Dua[];
  timestamp: number;
}

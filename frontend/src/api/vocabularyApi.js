// Thin client for the .NET VocabularyController.
// Base URL points at the ASP.NET Core dev server (see backend/README.md).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5209/api";

/**
 * @typedef {"StartsWith" | "EndsWith" | "Between"} SearchMode
 * @typedef {"Ascending" | "Descending"} SortDirection
 */

/**
 * Calls GET /api/vocabulary/search with the current filter state.
 *
 * @param {{ query: string, mode: SearchMode, maxResults: number|null, sortDirection: SortDirection, minLetterCount: number|null, maxLetterCount: number|null, pageNumber: number|null }} filters
 * @returns {Promise<{ results: Array, totalMatches: number }>}
 */
export async function searchVocabulary({
  query,
  mode,
  maxResults,
  sortDirection,
  minLetterCount,
  maxLetterCount,
  pageNumber
}) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  params.set("mode", mode);
  if (maxResults) params.set("maxResults", String(maxResults));
  params.set("sortDirection", sortDirection);
  if (minLetterCount) params.set("minLetterCount", String(minLetterCount));
  if (maxLetterCount) params.set("maxLetterCount", String(maxLetterCount));
  if (pageNumber) params.set("pageNumber", String(pageNumber));

  const response = await fetch(`${API_BASE_URL}/vocabulary/search?${params.toString()}`);

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message || `Search request failed (${response.status})`);
  }

  const data = await response.json();
  // ASP.NET Core's default JSON casing is camelCase, but normalize defensively
  // in case that ever changes (e.g. PascalCase results/totalMatches).
  return {
    results: data.results ?? data.Results ?? [],
    totalMatches: data.totalMatches ?? data.TotalMatches ?? 0
  };
}

/** Calls GET /api/vocabulary/count for the unfiltered total word count (header display). */
export async function getVocabularyCount() {
  const response = await fetch(`${API_BASE_URL}/vocabulary/count`);

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message || `Count request failed (${response.status})`);
  }

  return response.json();
}

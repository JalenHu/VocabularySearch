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
 * @param {{ query: string, mode: SearchMode, maxResults: number|null, sortDirection: SortDirection, minLetterCount: number|null, maxLetterCount: number|null, pageNumber: number|null, level: string|null }} filters
 * @returns {Promise<{ results: Array, totalMatches: number }>}
 */
export async function searchVocabulary({
  query,
  mode,
  maxResults,
  sortDirection,
  minLetterCount,
  maxLetterCount,
  pageNumber,
  level
}) {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  params.set("mode", mode);
  if (maxResults) params.set("maxResults", String(maxResults));
  params.set("sortDirection", sortDirection);
  if (minLetterCount) params.set("minLetterCount", String(minLetterCount));
  if (maxLetterCount) params.set("maxLetterCount", String(maxLetterCount));
  if (pageNumber) params.set("pageNumber", String(pageNumber));
  if (level) params.set("level", level);

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

/**
 * Calls GET /api/vocabulary/count for the unfiltered total word count of one
 * level (header display). Omit `level` for the backend's default level.
 *
 * @param {string|null} [level]
 */
export async function getVocabularyCount(level) {
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  const query = params.toString();

  const response = await fetch(`${API_BASE_URL}/vocabulary/count${query ? `?${query}` : ""}`);

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message || `Count request failed (${response.status})`);
  }

  return response.json();
}

/**
 * Calls GET /api/vocabulary/levels for the selectable word lists — one per
 * database — so the UI can offer a level picker under the page description.
 *
 * @returns {Promise<Array<{ key: string, label: string, description: string, wordCount: number }>>}
 */
export async function getVocabularyLevels() {
  const response = await fetch(`${API_BASE_URL}/vocabulary/levels`);

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(message || `Levels request failed (${response.status})`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

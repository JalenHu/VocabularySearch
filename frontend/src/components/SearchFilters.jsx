import "./SearchFilters.css";

const MATCH_MODES = [
  { value: "StartsWith", label: "字首 Start with" },
  { value: "EndsWith", label: "字尾 End with" },
  { value: "Between", label: "包含 Contains" }
];

// Letter count always goes shortest-to-longest (easier words first); these
// only flip the alphabetical order of words that share a letter count.
const SORT_DIRECTIONS = [
  { value: "Ascending", label: "A → Z" },
  { value: "Descending", label: "Z → A" }
];

/**
 * Live search filter bar: query text, match position (start/end/between),
 * a result-count cap, and sort direction by word (letter) count.
 * Mirrors the approved design's search bar + pill-group layout.
 */
export default function SearchFilters({ filters, onChange, onSearch }) {
  return (
    <form
      className="search-filters"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <div className="search-filters__bar">
        <input
          type="text"
          className="search-filters__input"
          placeholder="搜尋單字 / search..."
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          autoFocus
        />
        <button type="submit" className="search-filters__button">
          搜尋 Search
        </button>
      </div>

      <div className="search-filters__controls">
        <div className="pill-group" role="group" aria-label="搜尋方式">
          {MATCH_MODES.map((mode) => (
            <button
              key={mode.value}
              type="button"
              className={`pill ${filters.mode === mode.value ? "pill--active" : ""}`}
              onClick={() => onChange({ ...filters, mode: mode.value })}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <label className="count-field">
          <span className="count-field__label">顯示筆數</span>
          <input
            type="number"
            min="1"
            className="count-field__input"
            placeholder="全部"
            value={filters.maxResults ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                maxResults: e.target.value === "" ? null : Number(e.target.value)
              })
            }
          />
        </label>

        <label className="count-field">
          <span className="count-field__label">字母數</span>
          <input
            type="number"
            min="1"
            className="count-field__input count-field__input--range"
            placeholder="最少"
            value={filters.minLetterCount ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                minLetterCount: e.target.value === "" ? null : Number(e.target.value)
              })
            }
          />
          <span className="count-field__separator">–</span>
          <input
            type="number"
            min="1"
            className="count-field__input count-field__input--range"
            placeholder="最多"
            value={filters.maxLetterCount ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                maxLetterCount: e.target.value === "" ? null : Number(e.target.value)
              })
            }
          />
        </label>

        <div className="pill-group" role="group" aria-label="排序方式">
          {SORT_DIRECTIONS.map((dir) => (
            <button
              key={dir.value}
              type="button"
              className={`pill ${filters.sortDirection === dir.value ? "pill--active" : ""}`}
              onClick={() => onChange({ ...filters, sortDirection: dir.value })}
            >
              {dir.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}

import "./LevelSelector.css";

/**
 * Dropdown for picking which word list (level) to search — elementary,
 * junior high, high school, university, or TOEFL — all rows of one shared
 * table on the server, filtered by level key. Rendered directly under the
 * page description, above the search filters. Shows the word count for
 * whichever level is currently selected, so the total is visible without
 * having to search.
 */
export default function LevelSelector({ levels, selectedLevel, onChange, disabled }) {
  if (!levels || levels.length === 0) {
    return null;
  }

  const current = levels.find((level) => level.key === selectedLevel) ?? null;

  return (
    <div className="level-selector">
      <label className="level-selector__label" htmlFor="level-selector-select">
        單字庫
      </label>

      <select
        id="level-selector-select"
        className="level-selector__select"
        value={selectedLevel ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {levels.map((level) => (
          <option key={level.key} value={level.key}>
            {level.label}（{level.wordCount.toLocaleString()} 字）
          </option>
        ))}
      </select>

      {current && (
        <span className="level-selector__count">
          目前單字庫共 <strong>{current.wordCount.toLocaleString()}</strong> 個單字
        </span>
      )}
    </div>
  );
}

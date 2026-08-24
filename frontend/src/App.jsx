import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import SearchFilters from "./components/SearchFilters.jsx";
import ResultsGrid from "./components/ResultsGrid.jsx";
import Pagination from "./components/Pagination.jsx";
import LevelSelector from "./components/LevelSelector.jsx";
import { getVocabularyLevels, searchVocabulary } from "./api/vocabularyApi.js";

const DEFAULT_FILTERS = {
  query: "",
  mode: "StartsWith",
  maxResults: 20,
  sortDirection: "Ascending",
  minLetterCount: null,
  maxLetterCount: null
};

function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // The available word-list databases (elementary/junior/highschool/...)
  // and which one is currently selected for search. Each entry already
  // carries its own live word count, so the dropdown can show "how many
  // words" without a separate request.
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const selectedLevelInfo = useMemo(
    () => levels.find((level) => level.key === selectedLevel) ?? null,
    [levels, selectedLevel]
  );

  // Guards against an older, still-in-flight request overwriting a newer one.
  const latestRequestId = useRef(0);

  // Scroll target for "jump to the first word of the new page" — set by
  // handlePageChange, consumed once the new page has actually rendered
  // (see the isLoading effect below) so there's one clean scroll instead
  // of scrolling against the still-showing previous page's layout.
  const resultsTopRef = useRef(null);
  const pendingPageScrollRef = useRef(false);

  // Load the selectable word lists once on mount, and default to the first
  // one (the backend lists "elementary" first).
  useEffect(() => {
    let cancelled = false;

    getVocabularyLevels()
      .then((data) => {
        if (cancelled) return;
        setLevels(data);
        if (data.length > 0) {
          setSelectedLevel((current) => current ?? data[0].key);
        }
      })
      .catch(() => {
        /* Non-critical — the level dropdown simply won't render without levels. */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const runSearch = useCallback((currentFilters, pageNumber, level) => {
    const requestId = ++latestRequestId.current;
    setIsLoading(true);
    setError(null);

    searchVocabulary({ ...currentFilters, pageNumber, level })
      .then(({ results, totalMatches }) => {
        if (requestId !== latestRequestId.current) return;
        setResults(results);
        setTotalMatches(totalMatches);
        setHasSearched(true);
      })
      .catch((err) => {
        if (requestId !== latestRequestId.current) return;
        setError(err.message || "搜尋時發生錯誤，請確認後端 API 是否已啟動。");
        setResults([]);
      })
      .finally(() => {
        if (requestId === latestRequestId.current) setIsLoading(false);
      });
  }, []);

  // Search only runs when the user explicitly asks for it (button / Enter),
  // never on every keystroke — always restarts at page 1.
  const handleSearchNow = useCallback(() => {
    setPage(1);
    runSearch(filters, 1, selectedLevel);
  }, [filters, runSearch, selectedLevel]);

  // Paging through an existing result set doesn't require re-clicking search.
  const handlePageChange = useCallback(
    (nextPage) => {
      pendingPageScrollRef.current = true;
      setPage(nextPage);
      runSearch(filters, nextPage, selectedLevel);
    },
    [filters, runSearch, selectedLevel]
  );

  // Fires once the new page has finished loading and rendered, so the
  // scroll targets the new content instead of the page mid-transition.
  useEffect(() => {
    if (pendingPageScrollRef.current && !isLoading) {
      pendingPageScrollRef.current = false;
      resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isLoading]);

  // Switching word lists invalidates whatever was on screen — the old
  // results belong to a different database. The dropdown's own word count
  // updates immediately via selectedLevelInfo, no extra request needed.
  const handleLevelChange = useCallback((levelKey) => {
    setSelectedLevel(levelKey);
    setPage(1);
    setResults([]);
    setTotalMatches(0);
    setHasSearched(false);
    setError(null);
  }, []);

  const pageSize = filters.maxResults || 0;
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(totalMatches / pageSize)) : 1;

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__overline">Vocabulary Search · Chinese ⇄ English</p>
        <h1 className="page__title">依字母規則查單字</h1>
        <p className="page__subtitle">
          輸入字母並選擇搜尋方式：字首、字尾或包含，還能設定顯示筆數與字母排序方式，設定完成後按下搜尋。單字一律由易到難（字母少到多）排列。
        </p>

        <LevelSelector
          levels={levels}
          selectedLevel={selectedLevel}
          onChange={handleLevelChange}
          disabled={isLoading}
        />
      </header>

      <hr className="divider" />

      <section className="filters-section">
        <SearchFilters filters={filters} onChange={setFilters} onSearch={handleSearchNow} />
      </section>

      <hr className="divider" />

      <section className="results-section">
        <div ref={resultsTopRef} className="results-summary">
          {error ? (
            <span className="results-summary__error">{error}</span>
          ) : hasSearched ? (
            <span>
              顯示 <strong>{results.length}</strong> 筆，共{" "}
              <strong>{totalMatches}</strong> 筆符合
              {selectedLevelInfo && (
                <>
                  {" "}
                  （{selectedLevelInfo.label}，共 {selectedLevelInfo.wordCount.toLocaleString()} 字）
                </>
              )}
            </span>
          ) : (
            <span>輸入搜尋條件後按下「搜尋」查看結果。</span>
          )}
        </div>

        {hasSearched && <ResultsGrid words={results} isLoading={isLoading} />}

        {hasSearched && totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </section>
    </div>
  );
}

export default App;

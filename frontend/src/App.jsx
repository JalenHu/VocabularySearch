import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import SearchFilters from "./components/SearchFilters.jsx";
import ResultsGrid from "./components/ResultsGrid.jsx";
import Pagination from "./components/Pagination.jsx";
import { getVocabularyCount, searchVocabulary } from "./api/vocabularyApi.js";

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
  const [totalVocabulary, setTotalVocabulary] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guards against an older, still-in-flight request overwriting a newer one.
  const latestRequestId = useRef(0);

  // Header's "共收錄 N 個單字" is independent of the search filters/results.
  useEffect(() => {
    getVocabularyCount()
      .then(setTotalVocabulary)
      .catch(() => {
        /* Non-critical — header simply omits the count. */
      });
  }, []);

  const runSearch = useCallback((currentFilters, pageNumber) => {
    const requestId = ++latestRequestId.current;
    setIsLoading(true);
    setError(null);

    searchVocabulary({ ...currentFilters, pageNumber })
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
    runSearch(filters, 1);
  }, [filters, runSearch]);

  // Paging through an existing result set doesn't require re-clicking search.
  const handlePageChange = useCallback(
    (nextPage) => {
      setPage(nextPage);
      runSearch(filters, nextPage);
    },
    [filters, runSearch]
  );

  const pageSize = filters.maxResults || 0;
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(totalMatches / pageSize)) : 1;

  return (
    <div className="page">
      <header className="page__header">
        <p className="page__overline">Vocabulary Search · Chinese ⇄ English</p>
        <h1 className="page__title">依字母規則查單字</h1>
        <p className="page__subtitle">
          輸入字母並選擇搜尋方式：字首、字尾或包含，還能設定顯示筆數與字母排序方式，設定完成後按下搜尋。單字一律由易到難（字母少到多）排列。
          {totalVocabulary != null && (
            <>
              {" "}
              目前收錄 <strong>{totalVocabulary}</strong> 個單字。
            </>
          )}
        </p>
      </header>

      <hr className="divider" />

      <section className="filters-section">
        <SearchFilters filters={filters} onChange={setFilters} onSearch={handleSearchNow} />
      </section>

      <hr className="divider" />

      <section className="results-section">
        <div className="results-summary">
          {error ? (
            <span className="results-summary__error">{error}</span>
          ) : hasSearched ? (
            <span>
              顯示 <strong>{results.length}</strong> 筆，共{" "}
              <strong>{totalMatches}</strong> 筆符合
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

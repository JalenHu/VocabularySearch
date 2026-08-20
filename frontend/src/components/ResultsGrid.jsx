import "./ResultsGrid.css";

const POS_LABELS = {
  n: "noun",
  v: "verb",
  vi: "verb (intransitive)",
  vt: "verb (transitive)",
  adj: "adjective",
  "adj.": "adjective",
  adv: "adverb",
  pron: "pronoun",
  conj: "conjunction",
  prep: "preposition",
  int: "interjection",
  np: "phrase",
  aux: "auxiliary verb"
};

function fullPartOfSpeech(pos) {
  if (!pos) return undefined;
  const key = pos.trim().toLowerCase().replace(/\.$/, "");
  return POS_LABELS[key] ?? POS_LABELS[pos.trim().toLowerCase()] ?? undefined;
}

// One row per word, left-to-right in the same order as the source
// spreadsheet's columns: 字母數, 英語單字, 詞性, 中文單字, 造句,
// plus a "Learn more" link at the end to the dictionary entry.
export default function ResultsGrid({ words, isLoading }) {
  if (isLoading) {
    return <p className="results-grid__status">搜尋中…</p>;
  }

  if (words.length === 0) {
    return <p className="results-grid__status">找不到符合的單字，換個搜尋條件試試。</p>;
  }

  return (
    <div className="results-list">
      {words.map((word) => (
        <article key={word.id} className="word-row">
          <span className="word-row__count">{word.letterCount}</span>
          <span className="word-row__word">{word.englishWord}</span>
          <span className="word-row__pos" title={fullPartOfSpeech(word.partOfSpeech)}>
            {word.partOfSpeech || "—"}
          </span>
          <span className="word-row__meaning">{word.chineseMeaning}</span>
          {word.exampleSentence && <span className="word-row__sentence">{word.exampleSentence}</span>}
          {word.dictionaryUrl && (
            <a
              className="word-row__learn-more"
              href={word.dictionaryUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              查看字典 Learn more ›
            </a>
          )}
        </article>
      ))}
    </div>
  );
}

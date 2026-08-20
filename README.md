# Vocabulary Search Prototype (Chinese → English)

A prototype vocabulary search app for the elementary-school 1200-word list,
built with a .NET backend (data storage + API) and a React frontend (UI).

```
backend/    ASP.NET Core 8 Web API, EF Core + SQLite, seeded from the real 1200-word list
frontend/   React + Vite, styled to match the approved design mock
```

## What it does

- Search English words by letters, matching **start with**, **end with**,
  or **between with** (the letters appear anywhere in the word).
- Set how many results to show ("顯示筆數").
- Sort results by word (letter) count, ascending (A→Z, shortest first) or
  descending (Z→A, longest first).
- Each result card shows the English word, part of speech, letter count,
  and the Chinese meaning.

Affixes (prefixes/suffixes as a grouping concept) were intentionally left
out of this version, per your latest direction — the data model and UI are
plain word search now.

## Data

`backend/AffixLearnEnglish.Api/Seed/vocabulary_seed.json` was generated once
from your `國小英文1200單字.xlsx` (the `1200查詢表` sheet): 1,256 clean
entries after removing blank rows and exact duplicates. Columns kept:
English word, part of speech, Chinese meaning, and letter count (the
spreadsheet's own `字母數` column). The backend loads this file into a
SQLite database on first run.

## Running it locally

**Backend** (needs the .NET 8 SDK — this cloud sandbox couldn't install or
build it, so it hasn't been compiled here; the code follows standard
ASP.NET Core Web API patterns and should build as-is, but double check on
your machine):

```bash
cd backend/AffixLearnEnglish.Api
dotnet run
```

Starts on `http://localhost:5209` (Swagger UI at `/swagger` in dev mode).

**Frontend**:

```bash
cd frontend
npm install
npm run dev
```

Starts on `http://localhost:5173` and calls the backend at
`http://localhost:5209/api` by default (override via `frontend/.env`, see
`.env.example`).

## Design

Restyled to match the mock you shared (cream background, dark-brown accent
pills, card grid, rounded search bar). Since the original mock centered on
prefix/suffix groups and this version searches plain words instead, the
copy and card contents were adapted to fit — flag anything that should read
differently.

## What's next (API layer)

You mentioned we'd revisit the API layer later. Candidates once we get
there: pagination instead of a flat max-results cap, input validation
messages surfaced in the UI, caching/indexing for larger word lists, and
tests around the search/sort logic in `VocabularyService`.

## Assumptions made (flag if wrong)

- **"Between with"** = the search letters appear anywhere in the word
  (a "contains" match), as opposed to only at the start or end.
- **"Word count"** = number of letters in the English word (the
  spreadsheet's `字母數` column), and "min to max / max to min" sorts by
  that letter count.
- The "顯示筆數" (result count) field caps how many matches are returned,
  independent of the sort direction.

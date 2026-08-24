# Vocabulary Search Prototype (Chinese → English)

A prototype vocabulary search app for multiple Chinese-English word lists,
built with a .NET backend (data storage + API) and a React frontend (UI).

```
backend/    ASP.NET Core 8 Web API, EF Core + SQLite, one shared database with a level column
frontend/   React + Vite, styled to match the approved design mock
```

## What it does

- Choose which word list to search — a level picker sits right under the
  page description, above the search bar (see "Levels" below).
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

## Levels

All word lists live in one SQLite database (`vocabulary.db`), in a single
`VocabularyWords` table distinguished by a `Level` column. Each level is
still seeded once from its own JSON file in
`backend/AffixLearnEnglish.Api/Seed/`:

| Level key    | Label        | Source spreadsheet                     | Seed file                          |
|--------------|--------------|-----------------------------------------|-------------------------------------|
| `elementary` | 國小 1200字  | 國小英文1200單字.xlsx                   | `vocabulary_seed.json`              |
| `junior`     | 國中 2000字  | 國中兩千字2000字彙表.xlsx                | `vocabulary_seed_junior.json`       |
| `highschool` | 高中 5000字  | 高中英文5000單字字首排列.xlsx            | `vocabulary_seed_highschool.json`   |
| `university` | 大學 1萬字   | 大學一萬字.xlsx                          | `vocabulary_seed_university.json`   |
| `toefl`      | 托福必考單字 | 托福必考單字.xlsm                        | `vocabulary_seed_toefl.json`        |

`GET /api/vocabulary/levels` returns this list (key/label/description/live
word count) for the frontend's level picker. `GET /api/vocabulary/search`
and `GET /api/vocabulary/count` both accept an optional `level` query
parameter (one of the keys above); omitting it falls back to `elementary`.
Every query is scoped with `WHERE Level = ...` (indexed alongside the
existing `EnglishWord`/`LetterCount` lookups), so levels never mix.

The full list of levels and which seed file backs each lives in
`backend/AffixLearnEnglish.Api/Data/VocabularyLevelCatalog.cs` — add a row
there (plus a matching `Seed/*.json` file) to introduce another level; no
other code change is needed.

Each JSON seed file keeps the same columns as the original 1200-word list:
English word, part of speech, Chinese meaning, and letter count (each
spreadsheet's own `字母數` column). Rows with a blank word/meaning or a
non-numeric letter count were dropped; exact duplicate (word, part of
speech, meaning) rows were removed. The TOEFL sheet's `中文意思` column
was placeholder data (`0` for every row), so its `解釋` column — the real
definition text — was used as the Chinese meaning instead.

The backend seeds any level that doesn't have rows yet on startup, so first
run may take a moment longer than usual while the larger lists (university
~10k words) load. (An earlier version of this feature gave each level its
own `.db` file; those were merged into the one shared database.)

## Running it locally

**Backend** (needs the .NET 8 SDK):

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
differently. The level picker reuses the same pill styling as the existing
search-mode/sort controls so it reads as part of the same design system.

## What's next (API layer)

You mentioned we'd revisit the API layer later. Candidates once we get
there: input validation messages surfaced in the UI, caching (the
per-level `GetLevels()` word count currently does a fresh `COUNT(*)` per
level on every call — one grouped query would do), and tests around the
search/sort logic in `VocabularyService`.

## Assumptions made (flag if wrong)

- **"Between with"** = the search letters appear anywhere in the word
  (a "contains" match), as opposed to only at the start or end.
- **"Word count"** = number of letters in the English word (each
  spreadsheet's `字母數` column), and "min to max / max to min" sorts by
  that letter count.
- The "顯示筆數" (result count) field caps how many matches are returned,
  independent of the sort direction.
- Each level is fully independent — searching, sorting, and the result
  count are all scoped (via `WHERE Level = ...`) to whichever level is
  currently selected; there's no cross-level search.

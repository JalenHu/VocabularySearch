# Vocabulary Search — Frontend (React + Vite)

Searches the elementary-school 1200-word list by start-with / end-with /
between-with letter matching, with a result-count cap and word-count sort —
talking to the .NET backend in `../backend`.

## Run

```bash
npm install
cp .env.example .env   # only needed if the backend isn't on the default port
npm run dev
```

Opens at http://localhost:5173. Make sure the backend (`../backend/AffixLearnEnglish.Api`)
is running first — see its README for `dotnet run` instructions.

## Structure

- `src/api/vocabularyApi.js` — fetch client for `GET /api/vocabulary/search`.
- `src/components/SearchFilters.jsx` — search box + start/end/between pills,
  result-count field, and min↔max sort pills.
- `src/components/ResultsGrid.jsx` — card grid of matched words.
- `src/App.jsx` — wires filters state to the API with a short debounce.

## Note on design

Styling (colors, type, pill/card treatment in `index.css` / `App.css` /
component CSS) matches the approved mock. The API layer is intentionally
simple for this prototype — see the root `README.md` for what's next.

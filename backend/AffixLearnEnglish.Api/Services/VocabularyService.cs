using AffixLearnEnglish.Api.Data;
using AffixLearnEnglish.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AffixLearnEnglish.Api.Services;

/// <summary>
/// Implements the "start with / end with / between with" search plus
/// result-count limiting and word-count sort ordering described in the
/// product brief. This is intentionally simple for the prototype — it will
/// likely move behind a proper API layer (paging, caching, etc.) later.
/// </summary>
public class VocabularyService : IVocabularyService
{
    private readonly VocabularyDbContext _db;

    public VocabularyService(VocabularyDbContext db)
    {
        _db = db;
    }

    public VocabularySearchResponse Search(VocabularySearchRequest request)
    {
        var query = _db.VocabularyWords.AsQueryable();

        var term = request.Query?.Trim() ?? string.Empty;
        if (term.Length > 0)
        {
            query = request.Mode switch
            {
                SearchMatchMode.StartsWith => query.Where(w => EF.Functions.Like(w.EnglishWord, term + "%")),
                SearchMatchMode.EndsWith => query.Where(w => EF.Functions.Like(w.EnglishWord, "%" + term)),
                SearchMatchMode.Between => query.Where(w => EF.Functions.Like(w.EnglishWord, "%" + term + "%")),
                _ => query
            };
        }

        if (request.MinLetterCount is > 0)
        {
            query = query.Where(w => w.LetterCount >= request.MinLetterCount.Value);
        }

        if (request.MaxLetterCount is > 0)
        {
            query = query.Where(w => w.LetterCount <= request.MaxLetterCount.Value);
        }

        var totalMatches = query.Count();

        query = request.SortDirection == WordCountSortDirection.Ascending
            ? query.OrderBy(w => w.LetterCount).ThenBy(w => w.EnglishWord)
            : query.OrderByDescending(w => w.LetterCount).ThenBy(w => w.EnglishWord);

        if (request.MaxResults is > 0)
        {
            var pageNumber = Math.Max(request.PageNumber, 1);
            var skip = (pageNumber - 1) * request.MaxResults.Value;
            query = query.Skip(skip).Take(request.MaxResults.Value);
        }

        // Materialize first — building the dictionary URL needs Uri.EscapeDataString,
        // which EF Core cannot translate to SQL.
        var results = query
            .ToList()
            .Select(w => new VocabularyWordDto(
                w.Id,
                w.EnglishWord,
                w.PartOfSpeech,
                w.ChineseMeaning,
                w.LetterCount,
                BuildDictionaryUrl(w.EnglishWord),
                w.ExampleSentence))
            .ToList();

        return new VocabularySearchResponse(results, totalMatches);
    }

    /// <summary>
    /// Yahoo TW dictionary's "look up any word" search page. The source spreadsheet's
    /// hyperlink column used the same pattern (=HYPERLINK("http://tw.dictionary.yahoo.com/dictionary?p="&amp;word)),
    /// which now 301-redirects here.
    /// </summary>
    private static string BuildDictionaryUrl(string englishWord) =>
        $"https://tw.dictionary.search.yahoo.com/search?p={Uri.EscapeDataString(englishWord)}";
}

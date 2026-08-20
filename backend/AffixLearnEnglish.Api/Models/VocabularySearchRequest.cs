namespace AffixLearnEnglish.Api.Models;

/// <summary>
/// Query parameters accepted by GET /api/vocabulary/search.
/// </summary>
public class VocabularySearchRequest
{
    /// <summary>The letters to search for. Optional — an empty query returns all words (subject to MaxResults).</summary>
    public string? Query { get; set; }

    /// <summary>Whether Query must match the start, end, or anywhere within the word.</summary>
    public SearchMatchMode Mode { get; set; } = SearchMatchMode.StartsWith;

    /// <summary>Maximum number of results to return per page ("word counts for the result"). Null/0 = no limit/no paging.</summary>
    public int? MaxResults { get; set; }

    /// <summary>1-based page number, applied when MaxResults is set.</summary>
    public int PageNumber { get; set; } = 1;

    /// <summary>Sort direction by word (letter) count.</summary>
    public WordCountSortDirection SortDirection { get; set; } = WordCountSortDirection.Ascending;

    /// <summary>Only include words with at least this many letters. Null = no lower bound.</summary>
    public int? MinLetterCount { get; set; }

    /// <summary>Only include words with at most this many letters. Null = no upper bound.</summary>
    public int? MaxLetterCount { get; set; }
}

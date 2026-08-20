namespace AffixLearnEnglish.Api.Models;

/// <summary>
/// Sort direction applied to the result set, ordered by word (letter) count.
/// </summary>
public enum WordCountSortDirection
{
    /// <summary>Shortest words first.</summary>
    Ascending,

    /// <summary>Longest words first.</summary>
    Descending
}

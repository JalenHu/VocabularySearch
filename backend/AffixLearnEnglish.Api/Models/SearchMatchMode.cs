namespace AffixLearnEnglish.Api.Models;

/// <summary>
/// Where the search text must match within the English word.
/// </summary>
public enum SearchMatchMode
{
    /// <summary>Word starts with the search text, e.g. "ap" matches "apple".</summary>
    StartsWith,

    /// <summary>Word ends with the search text, e.g. "le" matches "apple".</summary>
    EndsWith,

    /// <summary>Search text appears anywhere in the word (including the middle), e.g. "pp" matches "apple".</summary>
    Between
}

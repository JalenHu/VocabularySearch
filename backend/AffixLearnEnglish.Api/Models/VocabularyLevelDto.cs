namespace AffixLearnEnglish.Api.Models;

/// <summary>
/// One selectable vocabulary level as returned to the frontend, with its
/// live word count, for GET /api/vocabulary/levels.
/// </summary>
public record VocabularyLevelDto(string Key, string Label, string Description, int WordCount);

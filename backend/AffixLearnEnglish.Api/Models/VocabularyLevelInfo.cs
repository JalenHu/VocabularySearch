namespace AffixLearnEnglish.Api.Models;

/// <summary>
/// Static metadata describing one selectable vocabulary level/word list
/// (e.g. elementary, junior high, TOEFL). All levels live in the same
/// database, distinguished by the VocabularyWord.Level column — see
/// <see cref="AffixLearnEnglish.Api.Data.VocabularyLevelCatalog"/> for the
/// full list.
/// </summary>
public record VocabularyLevelInfo(
    string Key,
    string Label,
    string Description,
    string SeedFileName
);

using AffixLearnEnglish.Api.Models;

namespace AffixLearnEnglish.Api.Services;

public interface IVocabularyService
{
    VocabularySearchResponse Search(VocabularySearchRequest request);

    /// <summary>The selectable vocabulary levels/word lists, each with its live word count.</summary>
    IReadOnlyList<VocabularyLevelDto> GetLevels();
}

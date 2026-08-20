using AffixLearnEnglish.Api.Models;

namespace AffixLearnEnglish.Api.Services;

public interface IVocabularyService
{
    VocabularySearchResponse Search(VocabularySearchRequest request);
}

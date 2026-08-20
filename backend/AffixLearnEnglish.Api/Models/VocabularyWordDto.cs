namespace AffixLearnEnglish.Api.Models;

/// <summary>
/// Shape returned to the frontend for each matched word.
/// </summary>
public record VocabularyWordDto(
    int Id,
    string EnglishWord,
    string PartOfSpeech,
    string ChineseMeaning,
    int LetterCount,
    string DictionaryUrl,
    string ExampleSentence
);

/// <summary>
/// Envelope returned by the search endpoint: the matched words plus the total
/// count before MaxResults was applied, so the UI can show "showing 20 of 143".
/// </summary>
public record VocabularySearchResponse(
    List<VocabularyWordDto> Results,
    int TotalMatches
);

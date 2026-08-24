namespace AffixLearnEnglish.Api.Models;

/// <summary>
/// A single vocabulary entry stored in the database. All levels share one
/// table; <see cref="Level"/> is the key from VocabularyLevelCatalog (e.g.
/// "elementary", "junior") that the search/count endpoints filter by.
/// </summary>
public class VocabularyWord
{
    public int Id { get; set; }

    /// <summary>Which vocabulary level/word list this entry belongs to — see VocabularyLevelCatalog.</summary>
    public string Level { get; set; } = string.Empty;

    /// <summary>The English word or phrase, e.g. "act", "department store".</summary>
    public string EnglishWord { get; set; } = string.Empty;

    /// <summary>Part of speech abbreviation, e.g. "n", "v", "adj", "np".</summary>
    public string PartOfSpeech { get; set; } = string.Empty;

    /// <summary>Chinese meaning/definition of the word.</summary>
    public string ChineseMeaning { get; set; } = string.Empty;

    /// <summary>Number of letters/characters in the English word (used for word-count sorting).</summary>
    public int LetterCount { get; set; }

    /// <summary>Optional example sentence ("造句"). Empty for most entries.</summary>
    public string ExampleSentence { get; set; } = string.Empty;
}

namespace AffixLearnEnglish.Api.Models;

/// <summary>
/// A single vocabulary entry stored in the database.
/// Sourced from the elementary-school 1200-word list (Chinese -> English).
/// </summary>
public class VocabularyWord
{
    public int Id { get; set; }

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

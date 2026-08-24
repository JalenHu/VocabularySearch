using AffixLearnEnglish.Api.Models;

namespace AffixLearnEnglish.Api.Data;

/// <summary>
/// The fixed list of vocabulary levels the app offers, and the seed JSON
/// file backing each. All levels share one SQLite database (VocabularyWord.Level
/// distinguishes them). To add another level: drop a new Seed/*.json file
/// (same shape as the existing ones) and add a row here — no other code
/// change is needed.
/// </summary>
public static class VocabularyLevelCatalog
{
    public const string DefaultLevelKey = "elementary";

    public static readonly IReadOnlyList<VocabularyLevelInfo> Levels = new List<VocabularyLevelInfo>
    {
        new("elementary", "國小 1200字", "國小英文1200單字", "vocabulary_seed.json"),
        new("junior", "國中 2000字", "國中兩千字", "vocabulary_seed_junior.json"),
        new("highschool", "高中 5000字", "高中英文5000單字", "vocabulary_seed_highschool.json"),
        new("university", "大學 1萬字", "大學一萬字", "vocabulary_seed_university.json"),
        new("toefl", "托福必考單字", "托福必考單字", "vocabulary_seed_toefl.json"),
    };

    public static VocabularyLevelInfo Default => Levels.First(l => l.Key == DefaultLevelKey);

    /// <summary>Resolves a level key (case-insensitive) to its catalog entry, falling back to the default level when the key is null, blank, or unrecognized.</summary>
    public static VocabularyLevelInfo Resolve(string? key)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            return Default;
        }

        return Levels.FirstOrDefault(l => string.Equals(l.Key, key, StringComparison.OrdinalIgnoreCase))
            ?? Default;
    }

    public static bool IsValidKey(string? key) =>
        !string.IsNullOrWhiteSpace(key) &&
        Levels.Any(l => string.Equals(l.Key, key, StringComparison.OrdinalIgnoreCase));
}

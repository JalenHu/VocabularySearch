using System.Text.Json;
using AffixLearnEnglish.Api.Models;

namespace AffixLearnEnglish.Api.Data;

/// <summary>
/// Loads every vocabulary level's word list from its own Seed/*.json file
/// into the shared VocabularyWords table on first run, tagging each row
/// with its level key. Every JSON file was generated once from the matching
/// source spreadsheet — see backend/README.md and
/// <see cref="VocabularyLevelCatalog"/> for which file backs which level.
/// </summary>
public static class DbSeeder
{
    private record SeedRow(string EnglishWord, string PartOfSpeech, string ChineseMeaning, int LetterCount, string ExampleSentence);

    /// <summary>Ensures the database exists and seeds any catalog level that doesn't have rows yet from its Seed/*.json file.</summary>
    public static void SeedAllLevels(VocabularyDbContext db, IWebHostEnvironment env)
    {
        db.Database.EnsureCreated();

        foreach (var level in VocabularyLevelCatalog.Levels)
        {
            SeedLevelIfEmpty(db, env, level);
        }
    }

    private static void SeedLevelIfEmpty(VocabularyDbContext db, IWebHostEnvironment env, VocabularyLevelInfo level)
    {
        if (db.VocabularyWords.Any(w => w.Level == level.Key))
        {
            return;
        }

        var seedPath = Path.Combine(env.ContentRootPath, "Seed", level.SeedFileName);
        if (!File.Exists(seedPath))
        {
            return;
        }

        var json = File.ReadAllText(seedPath);
        var rows = JsonSerializer.Deserialize<List<SeedRow>>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }) ?? new List<SeedRow>();

        var words = rows.Select(r => new VocabularyWord
        {
            Level = level.Key,
            EnglishWord = r.EnglishWord,
            PartOfSpeech = r.PartOfSpeech,
            ChineseMeaning = r.ChineseMeaning,
            LetterCount = r.LetterCount,
            ExampleSentence = r.ExampleSentence
        });

        db.VocabularyWords.AddRange(words);
        db.SaveChanges();
    }
}

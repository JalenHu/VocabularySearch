using System.Text.Json;
using AffixLearnEnglish.Api.Models;

namespace AffixLearnEnglish.Api.Data;

/// <summary>
/// Loads the elementary-school 1200-word list from Seed/vocabulary_seed.json
/// into the database on first run. The JSON was generated once from the
/// source spreadsheet (國小英文1200單字.xlsx) — see backend/README.md.
/// </summary>
public static class DbSeeder
{
    private record SeedRow(string EnglishWord, string PartOfSpeech, string ChineseMeaning, int LetterCount, string ExampleSentence);

    public static void SeedIfEmpty(VocabularyDbContext db, IWebHostEnvironment env)
    {
        if (db.VocabularyWords.Any())
        {
            return;
        }

        var seedPath = Path.Combine(env.ContentRootPath, "Seed", "vocabulary_seed.json");
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

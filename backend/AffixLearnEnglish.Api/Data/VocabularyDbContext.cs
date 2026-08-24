using AffixLearnEnglish.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AffixLearnEnglish.Api.Data;

public class VocabularyDbContext : DbContext
{
    public VocabularyDbContext(DbContextOptions<VocabularyDbContext> options) : base(options)
    {
    }

    public DbSet<VocabularyWord> VocabularyWords => Set<VocabularyWord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<VocabularyWord>(entity =>
        {
            entity.HasKey(w => w.Id);
            entity.Property(w => w.Level).IsRequired().HasMaxLength(20);
            entity.Property(w => w.EnglishWord).IsRequired().HasMaxLength(100);
            entity.Property(w => w.PartOfSpeech).HasMaxLength(20);
            entity.Property(w => w.ChineseMeaning).IsRequired().HasMaxLength(200);
            // Every query filters by Level first, so lead with it in both indexes.
            entity.HasIndex(w => new { w.Level, w.EnglishWord });
            entity.HasIndex(w => new { w.Level, w.LetterCount });
        });
    }
}

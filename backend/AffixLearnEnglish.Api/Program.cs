using AffixLearnEnglish.Api.Data;
using AffixLearnEnglish.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Render (and most container hosts) tell the app which port to listen on
// via the PORT env var, and expect it bound on 0.0.0.0. Locally PORT is
// unset, so this leaves Kestrel's normal defaults untouched.
var renderPort = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(renderPort))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{renderPort}");
}

const string FrontendCorsPolicy = "FrontendCorsPolicy";

// Frontend dev server origins (Vite default is 5173; CRA default is 3000).
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? new[] { "http://localhost:5173", "http://127.0.0.1:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// All vocabulary levels (elementary/junior/highschool/university/toefl)
// live in one database, distinguished by VocabularyWord.Level — see
// Data/VocabularyLevelCatalog.cs.
builder.Services.AddDbContext<VocabularyDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Vocabulary")
        ?? "Data Source=vocabulary.db"));

builder.Services.AddScoped<IVocabularyService, VocabularyService>();

var app = builder.Build();

// Ensure the database exists and seed any level that doesn't have rows yet
// from its Seed/*.json file.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<VocabularyDbContext>();
    DbSeeder.SeedAllLevels(db, app.Environment);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(FrontendCorsPolicy);
app.UseAuthorization();
app.MapControllers();

app.Run();

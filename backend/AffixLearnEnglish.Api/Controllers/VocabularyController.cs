using AffixLearnEnglish.Api.Models;
using AffixLearnEnglish.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AffixLearnEnglish.Api.Controllers;

/// <summary>
/// The single point of contact between the React frontend and the .NET
/// backend. The frontend's search filter panel (start with / end with /
/// between with, result count, sort direction) maps directly onto the
/// query parameters below.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class VocabularyController : ControllerBase
{
    private readonly IVocabularyService _vocabularyService;
    private readonly ILogger<VocabularyController> _logger;

    public VocabularyController(IVocabularyService vocabularyService, ILogger<VocabularyController> logger)
    {
        _vocabularyService = vocabularyService;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/vocabulary/search?query=ap&amp;mode=StartsWith&amp;maxResults=20&amp;sortDirection=Ascending
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(typeof(VocabularySearchResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public ActionResult<VocabularySearchResponse> Search(
        [FromQuery] string? query,
        [FromQuery] SearchMatchMode mode = SearchMatchMode.StartsWith,
        [FromQuery] int? maxResults = null,
        [FromQuery] WordCountSortDirection sortDirection = WordCountSortDirection.Ascending,
        [FromQuery] int? minLetterCount = null,
        [FromQuery] int? maxLetterCount = null,
        [FromQuery] int pageNumber = 1)
    {
        if (maxResults is < 0)
        {
            return BadRequest("maxResults must be zero/omitted (no limit) or a positive number.");
        }

        if (minLetterCount is < 0 || maxLetterCount is < 0)
        {
            return BadRequest("minLetterCount/maxLetterCount must be zero/omitted or a positive number.");
        }

        if (minLetterCount is > 0 && maxLetterCount is > 0 && minLetterCount > maxLetterCount)
        {
            return BadRequest("minLetterCount must not be greater than maxLetterCount.");
        }

        if (pageNumber < 1)
        {
            return BadRequest("pageNumber must be 1 or greater.");
        }

        var request = new VocabularySearchRequest
        {
            Query = query,
            Mode = mode,
            MaxResults = maxResults,
            SortDirection = sortDirection,
            MinLetterCount = minLetterCount,
            MaxLetterCount = maxLetterCount,
            PageNumber = pageNumber
        };

        var response = _vocabularyService.Search(request);
        _logger.LogInformation(
            "Vocabulary search: query='{Query}' mode={Mode} maxResults={MaxResults} sortDirection={SortDirection} minLetterCount={MinLetterCount} maxLetterCount={MaxLetterCount} pageNumber={PageNumber} -> {Count}/{Total} results",
            query, mode, maxResults, sortDirection, minLetterCount, maxLetterCount, pageNumber, response.Results.Count, response.TotalMatches);

        return Ok(response);
    }

    /// <summary>GET /api/vocabulary/count — total words available, used for the "1200 words" style header.</summary>
    [HttpGet("count")]
    public ActionResult<int> Count()
    {
        var response = _vocabularyService.Search(new VocabularySearchRequest());
        return Ok(response.TotalMatches);
    }
}

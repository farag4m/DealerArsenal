using DealerArsenal.Recon.Models;
using DealerArsenal.Recon.Services;
using Microsoft.AspNetCore.Mvc;

namespace DealerArsenal.Recon.Controllers;

[ApiController]
[Route("api/recon")]
public sealed class ReconController : ControllerBase
{
    private readonly IReconService _service;

    public ReconController(IReconService service)
    {
        _service = service;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<ReconQueue>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetQueue(CancellationToken cancellationToken)
    {
        var queue = await _service.GetQueueAsync(cancellationToken);
        return Ok(ApiResponse<ReconQueue>.Ok(queue));
    }

    [HttpGet("{issueId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ReconIssue>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetIssue(Guid issueId, CancellationToken cancellationToken)
    {
        var issue = await _service.GetIssueAsync(issueId, cancellationToken);
        return Ok(ApiResponse<ReconIssue>.Ok(issue));
    }

    [HttpPost("issues")]
    [ProducesResponseType(typeof(ApiResponse<ReconIssue>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateIssue([FromBody] CreateReconIssueRequest request, CancellationToken cancellationToken)
    {
        var issue = await _service.CreateIssueAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetIssue), new { issueId = issue.Id }, ApiResponse<ReconIssue>.Ok(issue));
    }

    [HttpPatch("{issueId:guid}/approve")]
    [ProducesResponseType(typeof(ApiResponse<ReconIssue>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ApproveIssue(Guid issueId, [FromBody] ApproveReconIssueRequest request, CancellationToken cancellationToken)
    {
        var issue = await _service.ApproveIssueAsync(issueId, request, cancellationToken);
        return Ok(ApiResponse<ReconIssue>.Ok(issue));
    }

    [HttpPatch("{issueId:guid}/deny")]
    [ProducesResponseType(typeof(ApiResponse<ReconIssue>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DenyIssue(Guid issueId, [FromBody] DenyReconIssueRequest request, CancellationToken cancellationToken)
    {
        var issue = await _service.DenyIssueAsync(issueId, request, cancellationToken);
        return Ok(ApiResponse<ReconIssue>.Ok(issue));
    }

    [HttpPatch("{issueId:guid}/assign")]
    [ProducesResponseType(typeof(ApiResponse<ReconIssue>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AssignIssue(Guid issueId, [FromBody] AssignReconIssueRequest request, CancellationToken cancellationToken)
    {
        var issue = await _service.AssignIssueAsync(issueId, request, cancellationToken);
        return Ok(ApiResponse<ReconIssue>.Ok(issue));
    }

    [HttpGet("aging")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ReconIssue>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAging(CancellationToken cancellationToken)
    {
        var aging = await _service.GetAgingAsync(cancellationToken);
        return Ok(ApiResponse<IReadOnlyList<ReconIssue>>.Ok(aging));
    }
}

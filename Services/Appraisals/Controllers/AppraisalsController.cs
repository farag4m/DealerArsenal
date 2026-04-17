using Appraisals.Models;
using Appraisals.Models.Dto;
using Appraisals.Services;
using Microsoft.AspNetCore.Mvc;

namespace Appraisals.Controllers;

[ApiController]
[Route("api/appraisals")]
public sealed class AppraisalsController : ControllerBase
{
    private readonly IAppraisalService _service;

    public AppraisalsController(IAppraisalService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResponse<AppraisalResponse>>>> GetQueue(
        [FromQuery] AppraisalFilterRequest filter,
        CancellationToken cancellationToken)
    {
        var result = await _service.GetQueueAsync(filter, cancellationToken);
        return Ok(ApiResponse<PagedResponse<AppraisalResponse>>.Ok(result));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<AppraisalResponse>>> GetById(
        string id,
        CancellationToken cancellationToken)
    {
        var result = await _service.GetByIdAsync(id, cancellationToken);
        return Ok(ApiResponse<AppraisalResponse>.Ok(result));
    }

    [HttpPatch("{id}/status")]
    public async Task<ActionResult<ApiResponse<AppraisalResponse>>> UpdateStatus(
        string id,
        [FromBody] UpdateStatusRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _service.UpdateStatusAsync(id, request, cancellationToken);
        return Ok(ApiResponse<AppraisalResponse>.Ok(result));
    }

    [HttpPost("{id}/offer")]
    public async Task<ActionResult<ApiResponse<AppraisalResponse>>> RecordOffer(
        string id,
        [FromBody] RecordOfferRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _service.RecordOfferAsync(id, request, cancellationToken);
        return Ok(ApiResponse<AppraisalResponse>.Ok(result));
    }

    [HttpPost("{id}/notes")]
    public async Task<ActionResult<ApiResponse<AppraisalResponse>>> AddNote(
        string id,
        [FromBody] AddNoteRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _service.AddNoteAsync(id, request, cancellationToken);
        return Ok(ApiResponse<AppraisalResponse>.Ok(result));
    }

    [HttpPost("{id}/acquire")]
    public async Task<ActionResult<ApiResponse<AppraisalResponse>>> Acquire(
        string id,
        CancellationToken cancellationToken)
    {
        var result = await _service.AcquireAsync(id, cancellationToken);
        return Ok(ApiResponse<AppraisalResponse>.Ok(result));
    }
}

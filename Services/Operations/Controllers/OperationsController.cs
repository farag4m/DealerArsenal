using System.Security.Claims;
using DealerArsenal.Operations.Infrastructure;
using DealerArsenal.Operations.Models;
using DealerArsenal.Operations.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DealerArsenal.Operations.Controllers;

[ApiController]
[Route("api/operations")]
[Authorize]
public sealed class OperationsController : ControllerBase
{
    private readonly IOperationsService _service;

    public OperationsController(IOperationsService service)
    {
        _service = service;
    }

    /// <summary>
    /// Personal task queue for the authenticated user.
    /// </summary>
    [HttpGet("my-day")]
    public async Task<ActionResult<ApiResponse<MyDayResponse>>> GetMyDay(CancellationToken ct)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedAccessException("User identity not found in token");

        var result = await _service.GetMyDayAsync(userId, ct);
        return Ok(ApiResponse<MyDayResponse>.Ok(result));
    }

    /// <summary>
    /// Update a task: complete, block, or snooze.
    /// </summary>
    [HttpPatch("tasks/{id}")]
    public async Task<ActionResult<ApiResponse<TaskDto>>> UpdateTask(
        string id,
        [FromBody] TaskUpdateRequest request,
        CancellationToken ct)
    {
        var result = await _service.UpdateTaskAsync(id, request, ct);
        return Ok(ApiResponse<TaskDto>.Ok(result));
    }

    /// <summary>
    /// Group work board with tasks segmented by status.
    /// </summary>
    [HttpGet("board")]
    public async Task<ActionResult<ApiResponse<BoardResponse>>> GetBoard(CancellationToken ct)
    {
        var result = await _service.GetBoardAsync(ct);
        return Ok(ApiResponse<BoardResponse>.Ok(result));
    }

    /// <summary>
    /// Manager team workload view — requires OWNER or GM role.
    /// </summary>
    [HttpGet("team")]
    [Authorize(Policy = "ManagerOnly")]
    public async Task<ActionResult<ApiResponse<TeamResponse>>> GetTeam(CancellationToken ct)
    {
        var result = await _service.GetTeamAsync(ct);
        return Ok(ApiResponse<TeamResponse>.Ok(result));
    }

    /// <summary>
    /// Individual staff queue — manager access only.
    /// </summary>
    [HttpGet("team/{staffId}/day")]
    [Authorize(Policy = "ManagerOnly")]
    public async Task<ActionResult<ApiResponse<StaffDayResponse>>> GetStaffDay(
        string staffId,
        CancellationToken ct)
    {
        var result = await _service.GetStaffDayAsync(staffId, ct);
        return Ok(ApiResponse<StaffDayResponse>.Ok(result));
    }

    /// <summary>
    /// Tasks list with vehicle and owner context, paginated.
    /// </summary>
    [HttpGet("tasks")]
    public async Task<ActionResult<ApiResponse<TasksResponse>>> GetTasks(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var result = await _service.GetTasksAsync(page, pageSize, ct);
        return Ok(ApiResponse<TasksResponse>.Ok(result));
    }

    /// <summary>
    /// Photo tracking — pending and completion status.
    /// </summary>
    [HttpGet("photos")]
    public async Task<ActionResult<ApiResponse<PhotosResponse>>> GetPhotos(CancellationToken ct)
    {
        var result = await _service.GetPhotosAsync(ct);
        return Ok(ApiResponse<PhotosResponse>.Ok(result));
    }
}

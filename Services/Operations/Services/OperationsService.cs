using DealerArsenal.Operations.Infrastructure;
using DealerArsenal.Operations.Models;
using DealerArsenal.Operations.Repositories;

namespace DealerArsenal.Operations.Services;

/// <summary>
/// Contains all business logic for the Operations domain.
/// Delegates all data access to IOperationsRepository — no direct DB access.
/// </summary>
public sealed class OperationsService : IOperationsService
{
    private readonly IOperationsRepository _repository;
    private readonly ILogger<OperationsService> _logger;

    private const int MinPage = 1;
    private const int MinPageSize = 1;
    private const int MaxPageSize = 100;

    public OperationsService(
        IOperationsRepository repository,
        ILogger<OperationsService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<MyDayResponse> GetMyDayAsync(string userId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new DomainException("UserId is required");

        _logger.LogInformation("GetMyDay started. UserId={UserId}", userId);

        var result = await _repository.GetMyDayAsync(userId, ct);

        _logger.LogInformation(
            "GetMyDay completed. UserId={UserId} TotalCount={TotalCount}",
            userId, result.TotalCount);

        return result;
    }

    public async Task<TaskDto> UpdateTaskAsync(
        string taskId, TaskUpdateRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(taskId))
            throw new DomainException("TaskId is required");

        ValidateUpdateRequest(request);

        _logger.LogInformation(
            "UpdateTask started. TaskId={TaskId} Action={Action}",
            taskId, request.Action);

        var result = await _repository.UpdateTaskAsync(taskId, request, ct);

        _logger.LogInformation(
            "UpdateTask completed. TaskId={TaskId} Action={Action} NewStatus={Status}",
            taskId, request.Action, result.Status);

        return result;
    }

    public async Task<BoardResponse> GetBoardAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("GetBoard started");

        var result = await _repository.GetBoardAsync(ct);

        _logger.LogInformation(
            "GetBoard completed. SegmentCount={SegmentCount} TotalCount={TotalCount}",
            result.Segments.Count, result.TotalCount);

        return result;
    }

    public async Task<TeamResponse> GetTeamAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("GetTeam started");

        var result = await _repository.GetTeamAsync(ct);

        _logger.LogInformation(
            "GetTeam completed. MemberCount={MemberCount} TotalActiveTasks={TotalActiveTasks}",
            result.Members.Count, result.TotalActiveTasks);

        return result;
    }

    public async Task<StaffDayResponse> GetStaffDayAsync(
        string staffId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(staffId))
            throw new DomainException("StaffId is required");

        _logger.LogInformation("GetStaffDay started. StaffId={StaffId}", staffId);

        var result = await _repository.GetStaffDayAsync(staffId, ct);

        _logger.LogInformation(
            "GetStaffDay completed. StaffId={StaffId} TotalCount={TotalCount}",
            staffId, result.TotalCount);

        return result;
    }

    public async Task<TasksResponse> GetTasksAsync(
        int page, int pageSize, CancellationToken ct = default)
    {
        if (page < MinPage)
            throw new DomainException($"Page must be >= {MinPage}");

        if (pageSize < MinPageSize || pageSize > MaxPageSize)
            throw new DomainException($"PageSize must be between {MinPageSize} and {MaxPageSize}");

        _logger.LogInformation(
            "GetTasks started. Page={Page} PageSize={PageSize}", page, pageSize);

        var result = await _repository.GetTasksAsync(page, pageSize, ct);

        _logger.LogInformation(
            "GetTasks completed. Page={Page} TotalCount={TotalCount}", page, result.TotalCount);

        return result;
    }

    public async Task<PhotosResponse> GetPhotosAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("GetPhotos started");

        var result = await _repository.GetPhotosAsync(ct);

        _logger.LogInformation(
            "GetPhotos completed. PendingCount={PendingCount} CompletedCount={CompletedCount}",
            result.PendingCount, result.CompletedCount);

        return result;
    }

    private static void ValidateUpdateRequest(TaskUpdateRequest request)
    {
        switch (request.Action)
        {
            case TaskAction.Snooze:
                if (request.SnoozeUntil is null)
                    throw new DomainException("SnoozeUntil is required when action is Snooze");

                if (request.SnoozeUntil <= DateTimeOffset.UtcNow)
                    throw new DomainException("SnoozeUntil must be in the future");
                break;

            case TaskAction.Block:
                if (string.IsNullOrWhiteSpace(request.BlockReason))
                    throw new DomainException("BlockReason is required when action is Block");
                break;

            case TaskAction.Complete:
                break;

            default:
                throw new DomainException($"Unknown action: {request.Action}");
        }
    }
}

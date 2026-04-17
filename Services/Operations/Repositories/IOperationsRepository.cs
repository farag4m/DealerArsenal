using DealerArsenal.Operations.Models;

namespace DealerArsenal.Operations.Repositories;

/// <summary>
/// Data access contract — all reads/writes go through DataAPI over HTTP.
/// No direct DB access per GLOBAL_RULES.md and MICROSERVICE_ARCH_RULES.md.
/// </summary>
public interface IOperationsRepository
{
    Task<MyDayResponse> GetMyDayAsync(string userId, CancellationToken ct = default);

    Task<TaskDto> UpdateTaskAsync(string taskId, TaskUpdateRequest request, CancellationToken ct = default);

    Task<BoardResponse> GetBoardAsync(CancellationToken ct = default);

    Task<TeamResponse> GetTeamAsync(CancellationToken ct = default);

    Task<StaffDayResponse> GetStaffDayAsync(string staffId, CancellationToken ct = default);

    Task<TasksResponse> GetTasksAsync(int page, int pageSize, CancellationToken ct = default);

    Task<PhotosResponse> GetPhotosAsync(CancellationToken ct = default);
}

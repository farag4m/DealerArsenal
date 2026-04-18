using DealerArsenal.Operations.Models;

namespace DealerArsenal.Operations.Services;

/// <summary>
/// Business logic contract for the Operations domain.
/// All validation and rule enforcement lives here — never in the controller.
/// </summary>
public interface IOperationsService
{
    Task<MyDayResponse> GetMyDayAsync(string userId, CancellationToken ct = default);

    Task<TaskDto> UpdateTaskAsync(string taskId, TaskUpdateRequest request, CancellationToken ct = default);

    Task<BoardResponse> GetBoardAsync(CancellationToken ct = default);

    Task<TeamResponse> GetTeamAsync(CancellationToken ct = default);

    Task<StaffDayResponse> GetStaffDayAsync(string staffId, CancellationToken ct = default);

    Task<TasksResponse> GetTasksAsync(int page, int pageSize, CancellationToken ct = default);

    Task<PhotosResponse> GetPhotosAsync(CancellationToken ct = default);
}

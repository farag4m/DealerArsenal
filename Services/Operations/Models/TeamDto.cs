namespace DealerArsenal.Operations.Models;

public sealed record TeamMemberWorkload(
    string StaffId,
    string Name,
    string Role,
    int OpenCount,
    int InProgressCount,
    int CompletedTodayCount,
    IReadOnlyList<TaskDto> ActiveTasks);

public sealed record TeamResponse(
    IReadOnlyList<TeamMemberWorkload> Members,
    int TotalActiveTasks);

public sealed record StaffDayResponse(
    string StaffId,
    string StaffName,
    IReadOnlyList<TaskDto> Tasks,
    int TotalCount);

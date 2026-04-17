namespace DealerArsenal.Operations.Models;

public enum TaskStatus
{
    Open,
    InProgress,
    Completed,
    Blocked,
    Snoozed,
}

public enum TaskPriority
{
    Low,
    Normal,
    High,
    Urgent,
}

public enum TaskAction
{
    Complete,
    Block,
    Snooze,
}

public sealed record TaskDto(
    string Id,
    string Title,
    TaskStatus Status,
    TaskPriority Priority,
    string? AssignedToId,
    string? AssignedToName,
    string? VehicleId,
    string? StockNumber,
    string? VehicleDescription,
    DateTimeOffset CreatedAt,
    DateTimeOffset? DueAt,
    DateTimeOffset? SnoozedUntil,
    string? BlockReason);

public sealed record TaskUpdateRequest(
    TaskAction Action,
    DateTimeOffset? SnoozeUntil = null,
    string? BlockReason = null);

public sealed record MyDayResponse(
    string UserId,
    IReadOnlyList<TaskDto> Tasks,
    int TotalCount,
    int CompletedCount,
    int PendingCount);

public sealed record BoardSegment(
    string Status,
    string Label,
    IReadOnlyList<TaskDto> Tasks);

public sealed record BoardResponse(
    IReadOnlyList<BoardSegment> Segments,
    int TotalCount);

public sealed record TasksResponse(
    IReadOnlyList<TaskDto> Tasks,
    int TotalCount,
    int Page,
    int PageSize);

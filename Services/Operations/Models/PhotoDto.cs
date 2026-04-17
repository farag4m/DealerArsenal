namespace DealerArsenal.Operations.Models;

public enum PhotoJobStatus
{
    Pending,
    InProgress,
    Complete,
}

public sealed record PhotoDto(
    string Id,
    string VehicleId,
    string StockNumber,
    string VehicleDescription,
    PhotoJobStatus Status,
    int PhotoCount,
    DateTimeOffset? CompletedAt,
    string? AssignedToId,
    string? AssignedToName);

public sealed record PhotosResponse(
    IReadOnlyList<PhotoDto> Photos,
    int PendingCount,
    int CompletedCount);

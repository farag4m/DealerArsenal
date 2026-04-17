namespace DealerArsenal.Recon.Models;

public enum ReconSegment
{
    NeedsDecision,
    InProgress,
    WaitingParts,
    AtVendor,
    Aging,
}

public enum ReconDecision
{
    Pending,
    Approved,
    Denied,
}

public sealed record ReconIssue
{
    public required Guid Id { get; init; }
    public required string StockNumber { get; init; }
    public required string VehicleDescription { get; init; }
    public required ReconSegment Segment { get; init; }
    public required ReconDecision Decision { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required int AgeInDays { get; init; }
    public decimal? ApprovedBudget { get; init; }
    public string? DenialReason { get; init; }
    public string? AssignedToVendor { get; init; }
    public string? AssignedToStaffId { get; init; }
    public string? Notes { get; init; }
    public DateTime? CompletedAt { get; init; }
}

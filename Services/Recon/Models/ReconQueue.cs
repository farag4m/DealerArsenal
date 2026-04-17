namespace DealerArsenal.Recon.Models;

public sealed record ReconQueue
{
    public required IReadOnlyList<ReconIssue> NeedsDecision { get; init; }
    public required IReadOnlyList<ReconIssue> InProgress { get; init; }
    public required IReadOnlyList<ReconIssue> WaitingParts { get; init; }
    public required IReadOnlyList<ReconIssue> AtVendor { get; init; }
    public required IReadOnlyList<ReconIssue> Aging { get; init; }
}

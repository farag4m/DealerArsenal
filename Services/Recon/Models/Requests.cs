namespace DealerArsenal.Recon.Models;

public sealed record CreateReconIssueRequest
{
    public required string StockNumber { get; init; }
    public required string VehicleDescription { get; init; }
    public string? Notes { get; init; }
}

public sealed record ApproveReconIssueRequest
{
    public required decimal Budget { get; init; }
}

public sealed record DenyReconIssueRequest
{
    public required string Reason { get; init; }
}

public sealed record AssignReconIssueRequest
{
    public string? VendorName { get; init; }
    public string? StaffId { get; init; }
}

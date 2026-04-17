namespace Appraisals.Models;

public sealed record Appraisal
{
    public required string Id { get; init; }
    public required string CustomerId { get; init; }
    public required string CustomerName { get; init; }
    public required string VehicleYear { get; init; }
    public required string VehicleMake { get; init; }
    public required string VehicleModel { get; init; }
    public string? Vin { get; init; }
    public required AppraisalStatus Status { get; init; }
    public string? AssignedTo { get; init; }
    public decimal? OfferAmount { get; init; }
    public DateTime? OfferExpiry { get; init; }
    public required DateTime SubmittedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public List<AppraisalNote> Notes { get; init; } = [];
}

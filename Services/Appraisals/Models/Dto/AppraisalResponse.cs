namespace Appraisals.Models.Dto;

public sealed class AppraisalResponse
{
    public required string Id { get; init; }
    public required string CustomerId { get; init; }
    public required string CustomerName { get; init; }
    public required string VehicleYear { get; init; }
    public required string VehicleMake { get; init; }
    public required string VehicleModel { get; init; }
    public string? Vin { get; init; }
    public required string Status { get; init; }
    public string? AssignedTo { get; init; }
    public decimal? OfferAmount { get; init; }
    public DateTime? OfferExpiry { get; init; }
    public required DateTime SubmittedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public List<AppraisalNoteResponse> Notes { get; init; } = [];

    public static AppraisalResponse FromModel(Appraisal appraisal) =>
        new()
        {
            Id = appraisal.Id,
            CustomerId = appraisal.CustomerId,
            CustomerName = appraisal.CustomerName,
            VehicleYear = appraisal.VehicleYear,
            VehicleMake = appraisal.VehicleMake,
            VehicleModel = appraisal.VehicleModel,
            Vin = appraisal.Vin,
            Status = appraisal.Status.ToString(),
            AssignedTo = appraisal.AssignedTo,
            OfferAmount = appraisal.OfferAmount,
            OfferExpiry = appraisal.OfferExpiry,
            SubmittedAt = appraisal.SubmittedAt,
            UpdatedAt = appraisal.UpdatedAt,
            Notes = appraisal.Notes.Select(AppraisalNoteResponse.FromModel).ToList()
        };
}

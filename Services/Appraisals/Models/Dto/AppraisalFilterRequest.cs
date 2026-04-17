namespace Appraisals.Models.Dto;

public sealed class AppraisalFilterRequest
{
    public string? Status { get; init; }

    /// <summary>Maximum age in hours for "fresh" appraisals. If null, no freshness filter is applied.</summary>
    public int? FreshnessHours { get; init; }

    public string? AssignedTo { get; init; }

    public int Page { get; init; } = 1;

    public int PageSize { get; init; } = 25;
}

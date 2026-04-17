using System.ComponentModel.DataAnnotations;

namespace Appraisals.Models.Dto;

public sealed class RecordOfferRequest
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Offer amount must be greater than zero.")]
    public required decimal Amount { get; init; }

    [Required]
    public required DateTime ExpiresAt { get; init; }
}

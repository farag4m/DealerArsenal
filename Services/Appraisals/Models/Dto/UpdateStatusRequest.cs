using System.ComponentModel.DataAnnotations;

namespace Appraisals.Models.Dto;

public sealed class UpdateStatusRequest
{
    [Required]
    public required string Status { get; init; }
}

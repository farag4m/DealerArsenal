using System.ComponentModel.DataAnnotations;

namespace Appraisals.Models.Dto;

public sealed class AddNoteRequest
{
    [Required]
    [MinLength(1)]
    [MaxLength(2000)]
    public required string Content { get; init; }

    [Required]
    public required string AuthorId { get; init; }

    [Required]
    public required string AuthorName { get; init; }
}

using System.ComponentModel.DataAnnotations;

namespace Customers.Models;

public sealed class AddNoteRequest
{
    [Required, MaxLength(2000)]
    public string Content { get; init; } = string.Empty;
}

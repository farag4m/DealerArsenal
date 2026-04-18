namespace Customers.Models;

public sealed class CustomerNote
{
    public string Id { get; init; } = string.Empty;
    public string CustomerId { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string AuthorId { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}

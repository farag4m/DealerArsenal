namespace Appraisals.Models;

public sealed record AppraisalNote
{
    public required string Id { get; init; }
    public required string AuthorId { get; init; }
    public required string AuthorName { get; init; }
    public required string Content { get; init; }
    public required DateTime CreatedAt { get; init; }
}

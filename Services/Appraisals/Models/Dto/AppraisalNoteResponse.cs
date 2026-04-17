namespace Appraisals.Models.Dto;

public sealed class AppraisalNoteResponse
{
    public required string Id { get; init; }
    public required string AuthorId { get; init; }
    public required string AuthorName { get; init; }
    public required string Content { get; init; }
    public required DateTime CreatedAt { get; init; }

    public static AppraisalNoteResponse FromModel(AppraisalNote note) =>
        new()
        {
            Id = note.Id,
            AuthorId = note.AuthorId,
            AuthorName = note.AuthorName,
            Content = note.Content,
            CreatedAt = note.CreatedAt
        };
}

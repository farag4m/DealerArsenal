namespace LobbyDisplay.Models;

public sealed record Appointment
{
    public required string FirstName { get; init; }
    public required DateTimeOffset ScheduledAt { get; init; }
}

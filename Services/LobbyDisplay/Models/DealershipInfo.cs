namespace LobbyDisplay.Models;

public sealed record DealershipInfo
{
    public required string Name { get; init; }
    public required string LogoUrl { get; init; }
    public required IReadOnlyList<BusinessHours> Hours { get; init; }
}

public sealed record BusinessHours
{
    public required string Day { get; init; }
    public required string Open { get; init; }
    public required string Close { get; init; }
}

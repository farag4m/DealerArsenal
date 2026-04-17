namespace LobbyDisplay.Models;

public sealed record FeaturedVehicle
{
    public required string PhotoUrl { get; init; }
    public required int Year { get; init; }
    public required string Make { get; init; }
    public required string Model { get; init; }
    public required decimal Price { get; init; }
}

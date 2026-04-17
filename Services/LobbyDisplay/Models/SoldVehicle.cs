namespace LobbyDisplay.Models;

public sealed record SoldVehicle
{
    public required string Model { get; init; }
    public required DateTimeOffset SoldDate { get; init; }
}

namespace LobbyDisplay.Models;

/// <summary>Aggregate response returned by GET /api/lobby-display.</summary>
public sealed record LobbyDisplaySnapshot(
    DealershipInfo Dealership,
    IReadOnlyList<Appointment> Appointments,
    IReadOnlyList<FeaturedVehicle> FeaturedVehicles,
    IReadOnlyList<SoldVehicle> SoldVehicles,
    Reputation Reputation
);

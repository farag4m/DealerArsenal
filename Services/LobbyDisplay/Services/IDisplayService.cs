using LobbyDisplay.Models;

namespace LobbyDisplay.Services;

public interface IDisplayService
{
    Task<IReadOnlyList<FeaturedVehicle>> GetFeaturedVehiclesAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Appointment>> GetUpcomingAppointmentsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SoldVehicle>> GetRecentlySoldAsync(CancellationToken cancellationToken = default);
    Task<DealershipInfo> GetDealershipInfoAsync(CancellationToken cancellationToken = default);
}

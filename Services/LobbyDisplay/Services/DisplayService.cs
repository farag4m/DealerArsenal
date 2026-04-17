using LobbyDisplay.Models;
using LobbyDisplay.Repositories;

namespace LobbyDisplay.Services;

public sealed class DisplayService : IDisplayService
{
    private readonly IDisplayRepository _repository;
    private readonly ILogger<DisplayService> _logger;

    public DisplayService(IDisplayRepository repository, ILogger<DisplayService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<IReadOnlyList<FeaturedVehicle>> GetFeaturedVehiclesAsync(
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching featured vehicles");
        var result = await _repository.GetFeaturedVehiclesAsync(cancellationToken);
        _logger.LogInformation("Fetched {Count} featured vehicles", result.Count);
        return result;
    }

    public async Task<IReadOnlyList<Appointment>> GetUpcomingAppointmentsAsync(
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching upcoming appointments");
        var result = await _repository.GetUpcomingAppointmentsAsync(cancellationToken);
        _logger.LogInformation("Fetched {Count} upcoming appointments", result.Count);
        return result;
    }

    public async Task<IReadOnlyList<SoldVehicle>> GetRecentlySoldAsync(
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching recently sold vehicles");
        var result = await _repository.GetRecentlySoldAsync(cancellationToken);
        _logger.LogInformation("Fetched {Count} recently sold vehicles", result.Count);
        return result;
    }

    public async Task<DealershipInfo> GetDealershipInfoAsync(
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching dealership info");
        var result = await _repository.GetDealershipInfoAsync(cancellationToken);
        _logger.LogInformation("Fetched dealership info for {Name}", result.Name);
        return result;
    }
}

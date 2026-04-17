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

    public async Task<Reputation> GetReputationAsync(
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching reputation");
        var result = await _repository.GetReputationAsync(cancellationToken);
        _logger.LogInformation("Fetched reputation: {Rating} stars, {Count} reviews", result.Rating, result.ReviewCount);
        return result;
    }

    public async Task<LobbyDisplaySnapshot> GetSnapshotAsync(
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching lobby display snapshot");

        var dealershipTask = _repository.GetDealershipInfoAsync(cancellationToken);
        var appointmentsTask = _repository.GetUpcomingAppointmentsAsync(cancellationToken);
        var featuredTask = _repository.GetFeaturedVehiclesAsync(cancellationToken);
        var soldTask = _repository.GetRecentlySoldAsync(cancellationToken);
        var reputationTask = _repository.GetReputationAsync(cancellationToken);

        await Task.WhenAll(dealershipTask, appointmentsTask, featuredTask, soldTask, reputationTask);

        var snapshot = new LobbyDisplaySnapshot(
            Dealership: await dealershipTask,
            Appointments: await appointmentsTask,
            FeaturedVehicles: await featuredTask,
            SoldVehicles: await soldTask,
            Reputation: await reputationTask
        );

        _logger.LogInformation("Snapshot fetched — {A} appointments, {F} featured, {S} sold",
            snapshot.Appointments.Count, snapshot.FeaturedVehicles.Count, snapshot.SoldVehicles.Count);

        return snapshot;
    }
}

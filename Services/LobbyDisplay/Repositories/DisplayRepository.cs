using System.Net.Http.Json;
using LobbyDisplay.Models;
using Serilog;

namespace LobbyDisplay.Repositories;

public sealed class DisplayRepository : IDisplayRepository
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<DisplayRepository> _logger;

    public DisplayRepository(HttpClient httpClient, ILogger<DisplayRepository> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<IReadOnlyList<FeaturedVehicle>> GetFeaturedVehiclesAsync(
        CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetFromJsonAsync<ApiResponse<List<FeaturedVehicle>>>(
            "api/lobby-display/featured", cancellationToken);

        return response?.Data?.AsReadOnly() ?? (IReadOnlyList<FeaturedVehicle>)[];
    }

    public async Task<IReadOnlyList<Appointment>> GetUpcomingAppointmentsAsync(
        CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetFromJsonAsync<ApiResponse<List<Appointment>>>(
            "api/lobby-display/appointments", cancellationToken);

        return response?.Data?.AsReadOnly() ?? (IReadOnlyList<Appointment>)[];
    }

    public async Task<IReadOnlyList<SoldVehicle>> GetRecentlySoldAsync(
        CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetFromJsonAsync<ApiResponse<List<SoldVehicle>>>(
            "api/lobby-display/sold-recent", cancellationToken);

        return response?.Data?.AsReadOnly() ?? (IReadOnlyList<SoldVehicle>)[];
    }

    public async Task<DealershipInfo> GetDealershipInfoAsync(
        CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetFromJsonAsync<ApiResponse<DealershipInfo>>(
            "api/lobby-display/dealership", cancellationToken);

        if (response?.Data is null)
        {
            _logger.LogError("DataAPI returned null dealership info");
            throw new InvalidOperationException("Dealership info unavailable from DataAPI.");
        }

        return response.Data;
    }

    public async Task<Reputation> GetReputationAsync(
        CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetFromJsonAsync<ApiResponse<Reputation>>(
            "api/lobby-display/reputation", cancellationToken);

        return response?.Data ?? new Reputation(Rating: 0m, ReviewCount: 0);
    }
}

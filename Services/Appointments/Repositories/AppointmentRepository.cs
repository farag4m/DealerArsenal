using System.Net;
using System.Net.Http.Json;
using DealerArsenal.Appointments.Models;
using Microsoft.Extensions.Logging;

namespace DealerArsenal.Appointments.Repositories;

public sealed class AppointmentRepository : IAppointmentRepository
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AppointmentRepository> _logger;

    public AppointmentRepository(HttpClient httpClient, ILogger<AppointmentRepository> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<IReadOnlyList<Appointment>> GetAllAsync(AppointmentListFilter filter, CancellationToken ct = default)
    {
        var query = BuildFilterQuery(filter);
        var response = await _httpClient.GetFromJsonAsync<DataApiResponse<IReadOnlyList<Appointment>>>(
            $"appointments{query}", ct);

        return response?.Data ?? [];
    }

    public async Task<Appointment?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var httpResponse = await _httpClient.GetAsync($"appointments/{id}", ct);

        if (httpResponse.StatusCode == HttpStatusCode.NotFound)
            return null;

        httpResponse.EnsureSuccessStatusCode();

        var response = await httpResponse.Content.ReadFromJsonAsync<DataApiResponse<Appointment>>(cancellationToken: ct);
        return response?.Data;
    }

    public async Task<Appointment> CreateAsync(CreateAppointmentRequest request, CancellationToken ct = default)
    {
        var httpResponse = await _httpClient.PostAsJsonAsync("appointments", request, ct);
        httpResponse.EnsureSuccessStatusCode();

        var response = await httpResponse.Content.ReadFromJsonAsync<DataApiResponse<Appointment>>(cancellationToken: ct);
        return response?.Data ?? throw new InvalidOperationException("DataAPI returned no appointment after create");
    }

    public async Task<Appointment> UpdateStatusAsync(Guid id, AppointmentStatus status, CancellationToken ct = default)
    {
        var httpResponse = await _httpClient.PatchAsJsonAsync($"appointments/{id}/status", new { status }, ct);
        httpResponse.EnsureSuccessStatusCode();

        var response = await httpResponse.Content.ReadFromJsonAsync<DataApiResponse<Appointment>>(cancellationToken: ct);
        return response?.Data ?? throw new InvalidOperationException("DataAPI returned no appointment after status update");
    }

    public async Task<VehicleReadiness> GetVehicleReadinessAsync(Guid id, CancellationToken ct = default)
    {
        var httpResponse = await _httpClient.GetAsync($"appointments/{id}/vehicle-readiness", ct);
        httpResponse.EnsureSuccessStatusCode();

        var response = await httpResponse.Content.ReadFromJsonAsync<DataApiResponse<VehicleReadiness>>(cancellationToken: ct);
        return response?.Data ?? throw new InvalidOperationException("DataAPI returned no vehicle readiness data");
    }

    public async Task<FollowUpTask> CreateFollowUpAsync(Guid id, CreateFollowUpRequest request, CancellationToken ct = default)
    {
        var httpResponse = await _httpClient.PostAsJsonAsync($"appointments/{id}/followup", request, ct);
        httpResponse.EnsureSuccessStatusCode();

        var response = await httpResponse.Content.ReadFromJsonAsync<DataApiResponse<FollowUpTask>>(cancellationToken: ct);
        return response?.Data ?? throw new InvalidOperationException("DataAPI returned no follow-up after create");
    }

    private static string BuildFilterQuery(AppointmentListFilter filter)
    {
        var parts = new List<string>();

        if (filter.Date.HasValue)
            parts.Add($"date={filter.Date.Value:yyyy-MM-dd}");

        if (filter.Status.HasValue)
            parts.Add($"status={filter.Status.Value}");

        if (!string.IsNullOrWhiteSpace(filter.AssignedStaffId))
            parts.Add($"assignedStaffId={Uri.EscapeDataString(filter.AssignedStaffId)}");

        return parts.Count > 0 ? "?" + string.Join("&", parts) : string.Empty;
    }

    private sealed record DataApiResponse<T>
    {
        public bool Success { get; init; }
        public T? Data { get; init; }
        public IReadOnlyList<string> Errors { get; init; } = [];
    }
}

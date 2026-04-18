using System.Net;
using System.Net.Http.Json;
using DealerArsenal.Operations.Models;

namespace DealerArsenal.Operations.Repositories;

/// <summary>
/// Fetches all Operations data from DataAPI over HTTP.
/// No direct DB access — all persistence goes through the DataAPI layer
/// per GLOBAL_RULES.md and MICROSERVICE_ARCH_RULES.md.
/// </summary>
public sealed class OperationsRepository : IOperationsRepository
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OperationsRepository> _logger;

    public OperationsRepository(
        IHttpClientFactory httpClientFactory,
        ILogger<OperationsRepository> logger)
    {
        _httpClient = httpClientFactory.CreateClient("DataApi");
        _logger = logger;
    }

    public async Task<MyDayResponse> GetMyDayAsync(string userId, CancellationToken ct = default)
    {
        var response = await _httpClient.GetAsync(
            $"api/operations/my-day?userId={Uri.EscapeDataString(userId)}", ct);

        await EnsureSuccessAsync(response, "GetMyDay", ct);

        return await response.Content.ReadFromJsonAsync<MyDayResponse>(ct)
               ?? throw new InvalidOperationException("DataAPI returned null for my-day");
    }

    public async Task<TaskDto> UpdateTaskAsync(
        string taskId, TaskUpdateRequest request, CancellationToken ct = default)
    {
        var response = await _httpClient.PatchAsJsonAsync(
            $"api/operations/tasks/{Uri.EscapeDataString(taskId)}", request, ct);

        await EnsureSuccessAsync(response, "UpdateTask", ct);

        return await response.Content.ReadFromJsonAsync<TaskDto>(ct)
               ?? throw new InvalidOperationException("DataAPI returned null for task update");
    }

    public async Task<BoardResponse> GetBoardAsync(CancellationToken ct = default)
    {
        var response = await _httpClient.GetAsync("api/operations/board", ct);

        await EnsureSuccessAsync(response, "GetBoard", ct);

        return await response.Content.ReadFromJsonAsync<BoardResponse>(ct)
               ?? throw new InvalidOperationException("DataAPI returned null for board");
    }

    public async Task<TeamResponse> GetTeamAsync(CancellationToken ct = default)
    {
        var response = await _httpClient.GetAsync("api/operations/team", ct);

        await EnsureSuccessAsync(response, "GetTeam", ct);

        return await response.Content.ReadFromJsonAsync<TeamResponse>(ct)
               ?? throw new InvalidOperationException("DataAPI returned null for team");
    }

    public async Task<StaffDayResponse> GetStaffDayAsync(string staffId, CancellationToken ct = default)
    {
        var response = await _httpClient.GetAsync(
            $"api/operations/team/{Uri.EscapeDataString(staffId)}/day", ct);

        await EnsureSuccessAsync(response, "GetStaffDay", ct);

        return await response.Content.ReadFromJsonAsync<StaffDayResponse>(ct)
               ?? throw new InvalidOperationException("DataAPI returned null for staff day");
    }

    public async Task<TasksResponse> GetTasksAsync(int page, int pageSize, CancellationToken ct = default)
    {
        var response = await _httpClient.GetAsync(
            $"api/operations/tasks?page={page}&pageSize={pageSize}", ct);

        await EnsureSuccessAsync(response, "GetTasks", ct);

        return await response.Content.ReadFromJsonAsync<TasksResponse>(ct)
               ?? throw new InvalidOperationException("DataAPI returned null for tasks");
    }

    public async Task<PhotosResponse> GetPhotosAsync(CancellationToken ct = default)
    {
        var response = await _httpClient.GetAsync("api/operations/photos", ct);

        await EnsureSuccessAsync(response, "GetPhotos", ct);

        return await response.Content.ReadFromJsonAsync<PhotosResponse>(ct)
               ?? throw new InvalidOperationException("DataAPI returned null for photos");
    }

    private async Task EnsureSuccessAsync(
        HttpResponseMessage response,
        string operation,
        CancellationToken ct)
    {
        if (response.IsSuccessStatusCode)
            return;

        if (response.StatusCode == HttpStatusCode.NotFound)
            throw new KeyNotFoundException($"Resource not found — DataAPI returned 404 for {operation}");

        // Log the DataAPI error body only in logs — never forward raw error to caller
        var body = await response.Content.ReadAsStringAsync(ct);
        _logger.LogError(
            "DataAPI error. Operation={Operation} StatusCode={StatusCode} Body={Body}",
            operation,
            (int)response.StatusCode,
            body);

        throw new HttpRequestException(
            $"DataAPI returned {(int)response.StatusCode} for {operation}",
            inner: null,
            statusCode: response.StatusCode);
    }
}

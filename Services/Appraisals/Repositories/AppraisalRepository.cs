using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Appraisals.Models;
using Appraisals.Models.Dto;
using Microsoft.Extensions.Logging;

namespace Appraisals.Repositories;

public sealed class AppraisalRepository : IAppraisalRepository
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AppraisalRepository> _logger;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() }
    };

    public AppraisalRepository(HttpClient httpClient, ILogger<AppraisalRepository> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<(List<Appraisal> Items, int Total)> GetQueueAsync(
        AppraisalFilterRequest filter,
        CancellationToken cancellationToken = default)
    {
        var query = BuildQueueQuery(filter);
        var response = await _httpClient.GetAsync($"appraisals{query}", cancellationToken);

        response.EnsureSuccessStatusCode();

        var paged = await response.Content.ReadFromJsonAsync<DataApiPagedResponse<Appraisal>>(
            JsonOptions, cancellationToken);

        return (paged?.Items ?? [], paged?.Total ?? 0);
    }

    public async Task<Appraisal?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetAsync($"appraisals/{Uri.EscapeDataString(id)}", cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadFromJsonAsync<Appraisal>(JsonOptions, cancellationToken);
    }

    public async Task<Appraisal> UpdateStatusAsync(
        string id,
        AppraisalStatus status,
        CancellationToken cancellationToken = default)
    {
        var payload = new { Status = status.ToString() };
        var response = await _httpClient.PatchAsJsonAsync(
            $"appraisals/{Uri.EscapeDataString(id)}/status",
            payload,
            JsonOptions,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<Appraisal>(JsonOptions, cancellationToken);
        return result ?? throw new InvalidOperationException("DataAPI returned null for UpdateStatus.");
    }

    public async Task<Appraisal> RecordOfferAsync(
        string id,
        decimal amount,
        DateTime expiresAt,
        CancellationToken cancellationToken = default)
    {
        var payload = new { Amount = amount, ExpiresAt = expiresAt };
        var response = await _httpClient.PostAsJsonAsync(
            $"appraisals/{Uri.EscapeDataString(id)}/offer",
            payload,
            JsonOptions,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<Appraisal>(JsonOptions, cancellationToken);
        return result ?? throw new InvalidOperationException("DataAPI returned null for RecordOffer.");
    }

    public async Task<Appraisal> AddNoteAsync(
        string id,
        AppraisalNote note,
        CancellationToken cancellationToken = default)
    {
        var payload = new
        {
            note.AuthorId,
            note.AuthorName,
            note.Content
        };

        var response = await _httpClient.PostAsJsonAsync(
            $"appraisals/{Uri.EscapeDataString(id)}/notes",
            payload,
            JsonOptions,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<Appraisal>(JsonOptions, cancellationToken);
        return result ?? throw new InvalidOperationException("DataAPI returned null for AddNote.");
    }

    public async Task<Appraisal> AcquireAsync(string id, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.PostAsync(
            $"appraisals/{Uri.EscapeDataString(id)}/acquire",
            content: null,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<Appraisal>(JsonOptions, cancellationToken);
        return result ?? throw new InvalidOperationException("DataAPI returned null for Acquire.");
    }

    private static string BuildQueueQuery(AppraisalFilterRequest filter)
    {
        var parts = new List<string>();

        if (!string.IsNullOrWhiteSpace(filter.Status))
            parts.Add($"status={Uri.EscapeDataString(filter.Status)}");

        if (filter.FreshnessHours.HasValue)
            parts.Add($"freshnessHours={filter.FreshnessHours.Value}");

        if (!string.IsNullOrWhiteSpace(filter.AssignedTo))
            parts.Add($"assignedTo={Uri.EscapeDataString(filter.AssignedTo)}");

        parts.Add($"page={filter.Page}");
        parts.Add($"pageSize={filter.PageSize}");

        return parts.Count > 0 ? "?" + string.Join("&", parts) : string.Empty;
    }

    private sealed class DataApiPagedResponse<T>
    {
        public List<T> Items { get; init; } = [];
        public int Total { get; init; }
    }
}

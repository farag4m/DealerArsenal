using DealerArsenal.Recon.Models;
using Serilog;

namespace DealerArsenal.Recon.Repositories;

public sealed class ReconRepository : IReconRepository
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<ReconRepository> _logger;

    public ReconRepository(IHttpClientFactory httpClientFactory, ILogger<ReconRepository> logger)
    {
        _httpClient = httpClientFactory.CreateClient("DataApi");
        _logger = logger;
    }

    public async Task<IReadOnlyList<ReconIssue>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetAsync("/api/data/recon", cancellationToken);
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<IReadOnlyList<ReconIssue>>>(cancellationToken: cancellationToken);
        return result?.Data ?? [];
    }

    public async Task<ReconIssue?> GetByIdAsync(Guid issueId, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetAsync($"/api/data/recon/{issueId}", cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            return null;
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<ReconIssue>>(cancellationToken: cancellationToken);
        return result?.Data;
    }

    public async Task<ReconIssue> CreateAsync(CreateReconIssueRequest request, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.PostAsJsonAsync("/api/data/recon", request, cancellationToken);
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<ReconIssue>>(cancellationToken: cancellationToken);
        return result!.Data!;
    }

    public async Task<ReconIssue> ApproveAsync(Guid issueId, decimal budget, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.PatchAsJsonAsync($"/api/data/recon/{issueId}/approve", new { Budget = budget }, cancellationToken);
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<ReconIssue>>(cancellationToken: cancellationToken);
        return result!.Data!;
    }

    public async Task<ReconIssue> DenyAsync(Guid issueId, string reason, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.PatchAsJsonAsync($"/api/data/recon/{issueId}/deny", new { Reason = reason }, cancellationToken);
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<ReconIssue>>(cancellationToken: cancellationToken);
        return result!.Data!;
    }

    public async Task<ReconIssue> AssignAsync(Guid issueId, string? vendorName, string? staffId, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.PatchAsJsonAsync($"/api/data/recon/{issueId}/assign", new { VendorName = vendorName, StaffId = staffId }, cancellationToken);
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<ReconIssue>>(cancellationToken: cancellationToken);
        return result!.Data!;
    }

    public async Task<IReadOnlyList<ReconIssue>> GetAgingAsync(int agingThresholdDays, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetAsync($"/api/data/recon/aging?thresholdDays={agingThresholdDays}", cancellationToken);
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<IReadOnlyList<ReconIssue>>>(cancellationToken: cancellationToken);
        return result?.Data ?? [];
    }
}

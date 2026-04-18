using System.Net;
using System.Text;
using System.Text.Json;
using Customers.Models;
using Microsoft.Extensions.Logging;

namespace Customers.Repositories;

public sealed class CustomersRepository : ICustomersRepository
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<CustomersRepository> _logger;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public CustomersRepository(IHttpClientFactory httpClientFactory, ILogger<CustomersRepository> logger)
    {
        _httpClient = httpClientFactory.CreateClient("DataAPI");
        _logger = logger;
    }

    public async Task<PagedResult<Customer>> SearchAsync(CustomerSearchParams searchParams, CancellationToken cancellationToken = default)
    {
        var query = BuildSearchQuery(searchParams);
        var response = await _httpClient.GetAsync($"customers{query}", cancellationToken);
        response.EnsureSuccessStatusCode();

        var result = await DeserializeAsync<PagedResult<Customer>>(response, cancellationToken);
        return result ?? new PagedResult<Customer>();
    }

    public async Task<Customer?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetAsync($"customers/{Uri.EscapeDataString(id)}", cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
            return null;

        response.EnsureSuccessStatusCode();
        return await DeserializeAsync<Customer>(response, cancellationToken);
    }

    public async Task<Customer> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        var content = new StringContent(JsonSerializer.Serialize(request, JsonOptions), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync("customers", content, cancellationToken);
        response.EnsureSuccessStatusCode();

        var customer = await DeserializeAsync<Customer>(response, cancellationToken);
        return customer ?? throw new InvalidOperationException("DataAPI returned empty customer on create");
    }

    public async Task<Customer?> UpdateAsync(string id, UpdateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        var content = new StringContent(JsonSerializer.Serialize(request, JsonOptions), Encoding.UTF8, "application/json");
        var response = await _httpClient.PutAsync($"customers/{Uri.EscapeDataString(id)}", content, cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
            return null;

        response.EnsureSuccessStatusCode();
        return await DeserializeAsync<Customer>(response, cancellationToken);
    }

    public async Task<CustomerNote> AddNoteAsync(string customerId, AddNoteRequest request, string authorId, CancellationToken cancellationToken = default)
    {
        var payload = new { request.Content, AuthorId = authorId };
        var content = new StringContent(JsonSerializer.Serialize(payload, JsonOptions), Encoding.UTF8, "application/json");
        var response = await _httpClient.PostAsync($"customers/{Uri.EscapeDataString(customerId)}/notes", content, cancellationToken);
        response.EnsureSuccessStatusCode();

        var note = await DeserializeAsync<CustomerNote>(response, cancellationToken);
        return note ?? throw new InvalidOperationException("DataAPI returned empty note on create");
    }

    private static string BuildSearchQuery(CustomerSearchParams p)
    {
        var parts = new List<string>();
        if (!string.IsNullOrWhiteSpace(p.Name)) parts.Add($"name={Uri.EscapeDataString(p.Name)}");
        if (!string.IsNullOrWhiteSpace(p.Phone)) parts.Add($"phone={Uri.EscapeDataString(p.Phone)}");
        if (!string.IsNullOrWhiteSpace(p.Email)) parts.Add($"email={Uri.EscapeDataString(p.Email)}");
        parts.Add($"page={p.Page}");
        parts.Add($"pageSize={p.PageSize}");
        return parts.Count > 0 ? "?" + string.Join("&", parts) : string.Empty;
    }

    private static async Task<T?> DeserializeAsync<T>(HttpResponseMessage response, CancellationToken cancellationToken)
    {
        var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        return await JsonSerializer.DeserializeAsync<T>(stream, JsonOptions, cancellationToken);
    }
}

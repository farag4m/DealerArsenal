using Customers.Models;
using Customers.Repositories;
using Microsoft.Extensions.Logging;

namespace Customers.Services;

public sealed class CustomersService : ICustomersService
{
    private readonly ICustomersRepository _repository;
    private readonly ILogger<CustomersService> _logger;

    public CustomersService(ICustomersRepository repository, ILogger<CustomersService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<PagedResult<Customer>> SearchAsync(CustomerSearchParams searchParams, CancellationToken cancellationToken = default)
    {
        if (searchParams.Page < 1)
            throw new ArgumentException("Page must be >= 1", nameof(searchParams));
        if (searchParams.PageSize is < 1 or > 100)
            throw new ArgumentException("PageSize must be between 1 and 100", nameof(searchParams));

        _logger.LogInformation("Searching customers with params {@SearchParams}", new
        {
            searchParams.Name,
            searchParams.Phone,
            HasEmail = !string.IsNullOrEmpty(searchParams.Email),
            searchParams.Page,
            searchParams.PageSize
        });

        return await _repository.SearchAsync(searchParams, cancellationToken);
    }

    public async Task<Customer> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("Customer id cannot be empty", nameof(id));

        var customer = await _repository.GetByIdAsync(id, cancellationToken);
        if (customer is null)
        {
            _logger.LogWarning("Customer {CustomerId} not found", id);
            throw new KeyNotFoundException($"Customer {id} not found");
        }

        return customer;
    }

    public async Task<Customer> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating customer");
        return await _repository.CreateAsync(request, cancellationToken);
    }

    public async Task<Customer> UpdateAsync(string id, UpdateCustomerRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("Customer id cannot be empty", nameof(id));

        var customer = await _repository.UpdateAsync(id, request, cancellationToken);
        if (customer is null)
        {
            _logger.LogWarning("Customer {CustomerId} not found for update", id);
            throw new KeyNotFoundException($"Customer {id} not found");
        }

        _logger.LogInformation("Updated customer {CustomerId}", id);
        return customer;
    }

    public async Task<CustomerNote> AddNoteAsync(string customerId, AddNoteRequest request, string authorId, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(customerId))
            throw new ArgumentException("Customer id cannot be empty", nameof(customerId));
        if (string.IsNullOrWhiteSpace(authorId))
            throw new ArgumentException("Author id cannot be empty", nameof(authorId));

        var note = await _repository.AddNoteAsync(customerId, request, authorId, cancellationToken);
        _logger.LogInformation("Added note to customer {CustomerId}", customerId);
        return note;
    }
}

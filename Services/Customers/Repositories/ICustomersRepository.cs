using Customers.Models;

namespace Customers.Repositories;

public interface ICustomersRepository
{
    Task<PagedResult<Customer>> SearchAsync(CustomerSearchParams searchParams, CancellationToken cancellationToken = default);
    Task<Customer?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<Customer> CreateAsync(CreateCustomerRequest request, CancellationToken cancellationToken = default);
    Task<Customer?> UpdateAsync(string id, UpdateCustomerRequest request, CancellationToken cancellationToken = default);
    Task<CustomerNote> AddNoteAsync(string customerId, AddNoteRequest request, string authorId, CancellationToken cancellationToken = default);
}

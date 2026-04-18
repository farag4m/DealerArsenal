namespace Customers.Models;

public sealed class CustomerSearchParams
{
    public string? Name { get; init; }
    public string? Phone { get; init; }
    public string? Email { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

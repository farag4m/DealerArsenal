using System.ComponentModel.DataAnnotations;

namespace Customers.Models;

public sealed class UpdateCustomerRequest
{
    [MaxLength(100)]
    public string? FirstName { get; init; }

    [MaxLength(100)]
    public string? LastName { get; init; }

    [EmailAddress, MaxLength(254)]
    public string? Email { get; init; }

    [Phone, MaxLength(30)]
    public string? Phone { get; init; }

    public ContactInfo? Address { get; init; }
}

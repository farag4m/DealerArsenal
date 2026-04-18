using System.ComponentModel.DataAnnotations;

namespace Customers.Models;

public sealed class CreateCustomerRequest
{
    [Required, MaxLength(100)]
    public string FirstName { get; init; } = string.Empty;

    [Required, MaxLength(100)]
    public string LastName { get; init; } = string.Empty;

    [Required, EmailAddress, MaxLength(254)]
    public string Email { get; init; } = string.Empty;

    [Phone, MaxLength(30)]
    public string Phone { get; init; } = string.Empty;

    public ContactInfo? Address { get; init; }
}

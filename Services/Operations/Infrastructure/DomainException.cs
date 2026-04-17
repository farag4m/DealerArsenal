namespace DealerArsenal.Operations.Infrastructure;

/// <summary>
/// Raised by the service layer for business rule violations.
/// Caught by GlobalExceptionHandler and mapped to HTTP 400.
/// </summary>
public sealed class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
}

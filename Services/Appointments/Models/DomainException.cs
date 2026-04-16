namespace DealerArsenal.Appointments.Models;

public sealed class DomainException : Exception
{
    public DomainException(string message) : base(message) { }
}

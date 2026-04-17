namespace DealerArsenal.Recon.Models;

public sealed class DomainException : Exception
{
    public DomainException(string message) : base(message)
    {
    }
}

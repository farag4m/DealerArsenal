namespace Appraisals.Services;

public sealed class AppraisalDomainException : Exception
{
    public AppraisalDomainException(string message) : base(message) { }
}

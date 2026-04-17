namespace Appraisals.Services;

public sealed class AppraisalNotFoundException : Exception
{
    public string AppraisalId { get; }

    public AppraisalNotFoundException(string appraisalId)
        : base($"Appraisal '{appraisalId}' was not found.")
    {
        AppraisalId = appraisalId;
    }
}

using Appraisals.Models;
using Appraisals.Models.Dto;

namespace Appraisals.Repositories;

public interface IAppraisalRepository
{
    Task<(List<Appraisal> Items, int Total)> GetQueueAsync(
        AppraisalFilterRequest filter,
        CancellationToken cancellationToken = default);

    Task<Appraisal?> GetByIdAsync(string id, CancellationToken cancellationToken = default);

    Task<Appraisal> UpdateStatusAsync(
        string id,
        AppraisalStatus status,
        CancellationToken cancellationToken = default);

    Task<Appraisal> RecordOfferAsync(
        string id,
        decimal amount,
        DateTime expiresAt,
        CancellationToken cancellationToken = default);

    Task<Appraisal> AddNoteAsync(
        string id,
        AppraisalNote note,
        CancellationToken cancellationToken = default);

    Task<Appraisal> AcquireAsync(string id, CancellationToken cancellationToken = default);
}

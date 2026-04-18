namespace DealerArsenal.Operations.Models;

/// <summary>
/// Standard envelope for all API responses per DATA_API_RULES.md.
/// Shape: { success, data, errors, meta }
/// </summary>
public sealed record ApiResponse<T>(
    bool Success,
    T? Data,
    IReadOnlyList<string> Errors,
    object? Meta = null)
{
    public static ApiResponse<T> Ok(T data, object? meta = null) =>
        new(true, data, [], meta);

    public static ApiResponse<T> Fail(string error) =>
        new(false, default, [error]);

    public static ApiResponse<T> Fail(IEnumerable<string> errors) =>
        new(false, default, [.. errors]);
}

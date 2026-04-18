namespace DealerArsenal.Appointments.Models;

public sealed record ApiResponse<T>
{
    public required bool Success { get; init; }
    public T? Data { get; init; }
    public required IReadOnlyList<string> Errors { get; init; }
    public object? Meta { get; init; }

    public static ApiResponse<T> Ok(T data) =>
        new() { Success = true, Data = data, Errors = [] };

    public static ApiResponse<T> Fail(params string[] errors) =>
        new() { Success = false, Data = default, Errors = errors };
}

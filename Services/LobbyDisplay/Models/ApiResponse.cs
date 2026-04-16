namespace LobbyDisplay.Models;

public sealed record ApiResponse<T>
{
    public bool Success { get; init; }
    public T? Data { get; init; }
    public IReadOnlyList<string> Errors { get; init; } = [];
    public object? Meta { get; init; }

    public static ApiResponse<T> Ok(T data, object? meta = null) =>
        new() { Success = true, Data = data, Errors = [], Meta = meta };

    public static ApiResponse<T> Fail(IEnumerable<string> errors) =>
        new() { Success = false, Data = default, Errors = errors.ToList().AsReadOnly(), Meta = null };

    public static ApiResponse<T> Fail(string error) =>
        Fail([error]);
}

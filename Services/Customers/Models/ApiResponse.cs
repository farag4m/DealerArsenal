namespace Customers.Models;

public sealed class ApiResponse<T>
{
    public bool Success { get; init; }
    public T? Data { get; init; }
    public List<string> Errors { get; init; } = [];
    public object? Meta { get; init; }

    public static ApiResponse<T> Ok(T data, object? meta = null) =>
        new() { Success = true, Data = data, Meta = meta };

    public static ApiResponse<T> Fail(params string[] errors) =>
        new() { Success = false, Errors = [.. errors] };
}

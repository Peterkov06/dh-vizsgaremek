namespace backend.Shared.Results
{
    public class ServiceResult
    {
        public bool Succeded { get; protected set; }
        public string? Error { get; protected set; }
        public int StatusCode { get; protected set; }

        public static ServiceResult Success() => new() { Succeded = true, StatusCode = 200 };
        public static ServiceResult Failure(string error, int statusCode = 400) => new() { Succeded = false, Error = error, StatusCode = statusCode };
        public static ServiceResult NotFound(string error) => new() { Succeded = false, Error = error, StatusCode = 404 };
        public static ServiceResult Unauthorized(string error) => new() { Succeded = false, Error = error, StatusCode = 403 };
    }
    public class ServiceResult<T> : ServiceResult
    {
        public T? Data { get; protected set; }

        public static ServiceResult<T> Success(T data) => new() { Succeded = true, StatusCode = 200, Data = data };
        public static new ServiceResult<T> Failure(string error, int statusCode = 400) => new() { Succeded = false, Error = error, StatusCode = statusCode };
        public static new ServiceResult<T> NotFound(string error) => new() { Succeded = false, Error = error, StatusCode = 404 };
        public static new ServiceResult<T> Unauthorized(string error) => new() { Succeded = false, Error = error, StatusCode = 403 };
    }
}

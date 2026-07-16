namespace IronCore.DTOs
{
    public record ServiceResult(bool Succeeded, IEnumerable<string> Errors)
    {
        public static ServiceResult Success()
            => new(true, []);

        public static ServiceResult Failure(IEnumerable<string> errors)
            => new(false, errors);
    }
}

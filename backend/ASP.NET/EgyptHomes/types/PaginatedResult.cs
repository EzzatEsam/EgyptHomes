public class PaginatedResult<T>
{
    public required List<T> Results { get; set; }
    public int TotalResults { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
namespace EgyptHomes.DTOs;
public class RefreshRequestDTO
{
    public required string RefreshToken { get; set; }
    public required string AccessToken { get; set; }
}
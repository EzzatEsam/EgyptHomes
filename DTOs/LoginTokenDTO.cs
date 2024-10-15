namespace EgyptHomes.DTOs;
public record LoginTokenDTO
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
    public DateTime ExpiresAt { get; set; }
    public required UserDTO User { get; set; }

}

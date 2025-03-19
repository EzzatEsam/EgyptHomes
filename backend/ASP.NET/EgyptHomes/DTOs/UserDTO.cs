using EgyptHomes.Models;

namespace EgyptHomes.DTOs;
public record UserDTO
{
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? PictureUrl { get; set; }
    public string? PhoneNumber { get; set; }
}

public static class UserDTOExtensions
{
    public static UserDTO ToDTO(this User user)
    {
        return new UserDTO
        {
            Id = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PictureUrl = user.PictureUrl,
            PhoneNumber = user.PhoneNumber
        };
    }
}
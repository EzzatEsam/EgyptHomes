using System.ComponentModel.DataAnnotations;

namespace EgyptHomes.DTOs;
public record RegisterDTO
{
    // public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    [Phone]
    public required string PhoneNumber { get; set; }
}

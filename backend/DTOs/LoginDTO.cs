using System.ComponentModel.DataAnnotations;

namespace EgyptHomes.DTOs;
public record LoginDTO
{
    [EmailAddress]
    public required string Email { get; set; }
    public required string Password { get; set; }
}
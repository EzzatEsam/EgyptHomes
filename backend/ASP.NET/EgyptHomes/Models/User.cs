using Microsoft.AspNetCore.Identity;
namespace EgyptHomes.Models;
public class User : IdentityUser
{

    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public string? PictureUrl { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }
    public  string Provider { get; set; } = "EgyptHomes";
    public ICollection<PropertyPost> PostedProperties { get; set; } = [];
    public ICollection<UserFavourite> Favourites { get; set; } = [];
}



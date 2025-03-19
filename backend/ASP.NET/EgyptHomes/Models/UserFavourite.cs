namespace EgyptHomes.Models;
public class UserFavourite : BaseModel
{
    public required string UserId { get; set; }
    public required long PropertyId { get; set; }
    public PropertyPost? Property { get; set; }
    public User? User { get; set; }
}
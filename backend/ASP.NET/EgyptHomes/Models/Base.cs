using System.ComponentModel.DataAnnotations;

namespace EgyptHomes.Models;
public class BaseModel
{
    public long Id { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }
    [Required]
    public DateTime UpdatedAt { get; set; }
}
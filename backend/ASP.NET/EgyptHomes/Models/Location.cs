using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EgyptHomes.Models;
public class Location : BaseModel
{

    public string? Street { get; set; }
    public required string City { get; set; }
    public required string Governorate { get; set; }

    public required float Latitude { get; set; }
    public required float Longitude { get; set; }

    [Required]
    [ForeignKey(nameof(PropertyPost))]
    public long PropertyId { get; set; }

    public PropertyPost? Property { get; set; }
}
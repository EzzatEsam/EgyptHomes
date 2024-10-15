
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EgyptHomes.Models;
public class PropertyPost : BaseModel
{
    [MaxLength(300)]
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required decimal Price { get; set; }

    public required Location Location { get; set; }

    public required PropertyType PropertyType { get; set; } = PropertyType.Buy;

    public User? User { get; set; }

    [Required]
    public string? UserId { get; set; }
    public string? ContactPhone { get; set; }
    public string? ContactEmail { get; set; }
    public PropertyCategory? Category { get; set; }

    public int? NumberOfBedrooms { get; set; }
    public int? NumberOfBathrooms { get; set; }
    public int? Area { get; set; }
    public bool? HasGarage { get; set; }
    public bool? HasSwimmingPool { get; set; }
    public bool? HasGarden { get; set; }
    public bool? HasAirConditioning { get; set; }
    public List<PropertyImage> Images { get; set; } = [];
    public List<UserFavourite> Favourites { get; set; } = [];

    [NotMapped]
    public bool? IsFavorited { get; set; }
}
public enum PropertyType
{
    Rent,
    Buy,
}

public enum PropertyCategory
{
    House,
    DetachedHouse,
    SemiDetachedHouse,
    Townhouse,
    Bungalow,

    Flat,
    StudioFlat,
    Penthouse,
    Duplex,

    Office,
    SharedOffice,
    PrivateOffice,
    CoWorkingSpace,

    Shop,
    RetailStore,
    Supermarket,
    Boutique,

    Villa,
    BeachVilla,
    MountainVilla,

    Pharmacy,
    Clinic,
}

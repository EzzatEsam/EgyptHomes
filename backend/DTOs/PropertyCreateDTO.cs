using System.ComponentModel.DataAnnotations;
using EgyptHomes.Models;

namespace EgyptHomes.DTOs;
public class PropertyCreateDTO
{

    [MaxLength(300)]
    public required string Title { get; set; }

    public required string Description { get; set; }

    public required decimal Price { get; set; }

    public required LocationDto Location { get; set; }

    public PropertyType PropertyType { get; set; } = PropertyType.Buy;

    public string? ContactPhone { get; set; }

    public string? ContactEmail { get; set; }

    public PropertyCategory Category { get; set; }

    public int? NumberOfBedrooms { get; set; }

    public int? NumberOfBathrooms { get; set; }

    public int Area { get; set; }

    public bool? HasGarage { get; set; }
    public bool? HasSwimmingPool { get; set; }
    public bool? HasGarden { get; set; }
    public bool? HasAirConditioning { get; set; }

    public List<string> Images { get; set; } = [];

}


public static class PropertyCreateDTOExtensions
{
    public static PropertyPost ToModel(this PropertyCreateDTO propertyCreateDTO)
    {
        return new PropertyPost
        {
            Area = propertyCreateDTO.Area,
            Category = propertyCreateDTO.Category,
            ContactEmail = propertyCreateDTO.ContactEmail,
            ContactPhone = propertyCreateDTO.ContactPhone,
            Description = propertyCreateDTO.Description,
            HasGarage = propertyCreateDTO.HasGarage,
            HasAirConditioning = propertyCreateDTO.HasAirConditioning,
            HasGarden = propertyCreateDTO.HasGarden,
            HasSwimmingPool = propertyCreateDTO.HasSwimmingPool,
            Location = propertyCreateDTO.Location.ToModel(),
            NumberOfBathrooms = propertyCreateDTO.NumberOfBathrooms,
            NumberOfBedrooms = propertyCreateDTO.NumberOfBedrooms,
            PropertyType = propertyCreateDTO.PropertyType,
            Price = propertyCreateDTO.Price,
            Title = propertyCreateDTO.Title
        };
    }
}
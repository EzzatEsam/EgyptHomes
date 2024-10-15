using System.ComponentModel.DataAnnotations;
using EgyptHomes.Models;

namespace EgyptHomes.DTOs;

public class PropertyPostDto
{

    public required long Id { get; set; }
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public required decimal Price { get; set; }
    public required LocationDto Location { get; set; }
    public PropertyType PropertyType { get; set; } = PropertyType.Buy;
    public string? ContactPhone { get; set; }
    public string? ContactEmail { get; set; }
    public PropertyCategory? Category { get; set; }
    public IEnumerable<string> Images { get; set; } = [];
    public int? NumberOfBedrooms { get; set; }
    public int? NumberOfBathrooms { get; set; }
    public int? Area { get; set; }
    public bool? HasGarage { get; set; }
    public bool? HasSwimmingPool { get; set; }
    public bool? HasGarden { get; set; }
    public bool? HasAirConditioning { get; set; }
    public required UserDTO? User { get; set; }
    public required DateTime CreatedAt { get; set; }
    public bool? IsFavorited { get; set; }
}

public static class PropertyPostExtensions
{
    public static PropertyPostDto ToDTO(this PropertyPost propertyPost)
    {
        return new PropertyPostDto
        {
            Id = propertyPost.Id,
            Location = propertyPost.Location.ToDTO(),
            Area = propertyPost.Area,
            Category = propertyPost.Category,
            ContactEmail = propertyPost.ContactEmail,
            ContactPhone = propertyPost.ContactPhone,
            Description = propertyPost.Description,
            HasGarage = propertyPost.HasGarage,
            HasSwimmingPool = propertyPost.HasSwimmingPool,
            HasGarden = propertyPost.HasGarden,
            HasAirConditioning = propertyPost.HasAirConditioning,
            Title = propertyPost.Title,
            NumberOfBathrooms = propertyPost.NumberOfBathrooms,
            NumberOfBedrooms = propertyPost.NumberOfBedrooms,
            PropertyType = propertyPost.PropertyType,
            Price = propertyPost.Price,
            CreatedAt = propertyPost.CreatedAt,
            User = propertyPost.User?.ToDTO(),
            Images = propertyPost.Images.Select(i => "/images/" + i.Id.ToString() + ".webp"),
            IsFavorited = propertyPost.IsFavorited

        };
    }


    public static PropertyPost ToModel(this PropertyPostDto propertyPostDto)
    {
        var location = propertyPostDto.Location.ToModel();

        return new PropertyPost
        {
            Location = location,
            Area = propertyPostDto.Area,
            ContactPhone = propertyPostDto.ContactPhone,
            Description = propertyPostDto.Description,
            Title = propertyPostDto.Title,
            PropertyType = propertyPostDto.PropertyType,
            Price = propertyPostDto.Price,
        };
    }
}


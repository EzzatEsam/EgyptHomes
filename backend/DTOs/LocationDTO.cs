
using EgyptHomes.Models;

namespace EgyptHomes.DTOs;
public class LocationDto
{
    public string? Street { get; set; }
    public required string City { get; set; } = string.Empty;
    public required string Governorate { get; set; } = string.Empty;
    public float Latitude { get; set; }
    public float Longitude { get; set; }
}

public static class LocationExtension
{
    public static LocationDto ToDTO(this Location location)
    {
        return new LocationDto
        {
            City = location.City,
            Governorate = location.Governorate,
            Latitude = location.Latitude,
            Longitude = location.Longitude,
            Street = location.Street
        };
    }

    public static Location ToModel(this LocationDto locationDto)
    {
        return new Location
        {
            Street = locationDto.Street,
            City = locationDto.City,
            Governorate = locationDto.Governorate,
            Latitude = locationDto.Latitude,
            Longitude = locationDto.Longitude,
        };
    }

}
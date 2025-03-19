using EgyptHomes.Models;
namespace EgyptHomes.DTOs;

public class PropertySearchDTO
{
    public string? City { get; set; }
    public string? Governorate { get; set; }
    public int? MinBathrooms { get; set; }
    public int? MinBedrooms { get; set; }
    public string? Street { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public PropertyType? PropertyType { get; set; }
    public PropertyCategory? PropertyCategory { get; set; }
    public bool HasGarage { get; set; } = false;
    public bool HasSwimmingPool { get; set; } = false;
    public bool HasGarden { get; set; } = false;
    public bool HasAirConditioning { get; set; } = false;
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}


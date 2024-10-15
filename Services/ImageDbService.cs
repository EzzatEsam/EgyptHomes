using EgyptHomes.Models;
using EgyptHomes.Services;
using EgyptHomes.Types;
using Microsoft.EntityFrameworkCore;

namespace EgyptHomes.Services;
public class ImageDbService(ApplicationDbContext dbContext)
{
    private readonly ApplicationDbContext _dbContext = dbContext;

    public async Task<Error?> AddImageToProperty(PropertyImage propertyImage)
    {

        try
        {
            await _dbContext.PropertyImages.AddAsync(propertyImage);
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return new Error()
            {
                Message = "Failed to add image to property",
                Details = e.StackTrace
            };
        }
        return null;
    }

    public async Task<Error?> DeleteImage(Guid id)
    {
        var image = await _dbContext.PropertyImages.FirstOrDefaultAsync(i => i.Id == id);
        if (image == null)
        {
            return new Error()
            {
                Message = "Image not found"
            };
        }
        try
        {
            _dbContext.PropertyImages.Remove(image);
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception e)
        {
            return new Error()
            {
                Message = e.Message,
                Details = e.StackTrace
            };
        }
        return null;
    }

}
using EgyptHomes.Types;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.PixelFormats;

namespace EgyptHomes.Services;
public class ImageIOService
{
    private readonly int _quality = 75;
    public Error? SaveImage(IFormFile image, Guid guid)
    {
        var path = Path.Combine("wwwroot", "images", guid.ToString() + ".webp");
        try
        {
            using var imageSharpImage = Image.Load<Rgba32>(image.OpenReadStream());
            imageSharpImage.SaveAsWebp(path, new WebpEncoder { Quality = _quality });
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


    public Error? SaveImage(string imageB64, Guid guid)
    {
        var path = Path.Combine("wwwroot", "images", guid.ToString() + ".webp");
        try
        {
            var bytes = Convert.FromBase64String(imageB64);
            using var imageSharpImage = Image.Load<Rgba32>(bytes);
            imageSharpImage.SaveAsWebp(path, new WebpEncoder { Quality = _quality });
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


    public Error? DeleteImage(string path)
    {
        try
        {
            File.Delete(path);
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


    public async Task<byte[]?> GetImage(string path)
    {
        try
        {
            return await File.ReadAllBytesAsync(path);
        }
        catch
        {
            return null;
        }
    }
}
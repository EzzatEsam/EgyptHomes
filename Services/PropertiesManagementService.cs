
using EgyptHomes.DTOs;
using EgyptHomes.Models;
using EgyptHomes.Types;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace EgyptHomes.Services;
public class PropertyManagementService(ApplicationDbContext dbContext)
{
    // private readonly ApplicationDbContext _dbContext = dbContext;

    private readonly ApplicationDbContext _dbContext = dbContext;

    public async Task<Error?> CreateProperty(PropertyPost property)
    {
        try
        {

            await _dbContext.Properties.AddAsync(property);
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

    public async Task<PropertyPost?> GetProperty(long id, string? userId = null)
    {
        var q = _dbContext.Properties
        .Include(p => p.Images)
        .Include(p => p.Location)
        .Include(p => p.Images)
        .Include(p => p.User)
        .Where(p => p.Id == id)
        .AsNoTracking();

        if (userId is null)
        {
            return await q.FirstOrDefaultAsync();

        }
        else
        {
            var q2 = q.Select(p => new
            {
                p,
                hasFav = p.Favourites.Any(f => f.UserId == userId)
            });

            var res = await q2.FirstOrDefaultAsync();
            if (res is null) return null;
            var pr = res.p;
            pr.IsFavorited = res.hasFav;
            return pr;
        }
    }
    public async Task<Error?> UpdateProperty(PropertyPost property)
    {
        try
        {
            _dbContext.Properties.Update(property);
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


    public async Task<PaginatedResult<PropertyPost>> GetFavourites(User user, int page = 1, int pageSize = 10)
    {
        var result = _dbContext.UserFavourites
            .Where(f => f.UserId == user.Id)
            .Include(f => f.Property).ThenInclude(p => p!.Images)
            .Include(f => f.Property).ThenInclude(p => p!.Location)
            .Include(f => f.Property).ThenInclude(p => p!.User)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => f.Property!);

        var count = await result.CountAsync();
        var res = await result.Skip((page - 1) * pageSize).Take(pageSize).AsNoTracking().ToListAsync();

        for (int i = 0; i < res.Count; i++)
        {
            res[i].IsFavorited = true;
        }
        return new PaginatedResult<PropertyPost>
        {
            Results = res,
            Page = page,
            PageSize = pageSize,
            TotalResults = count,
            TotalPages = (int)Math.Ceiling(count / (double)pageSize)
        };

    }

    public async Task<Error?> AddFavourite(long propertyId, string userId)
    {
        var result = await _dbContext.UserFavourites.Where(f => f.UserId == userId && f.PropertyId == propertyId).FirstOrDefaultAsync();
        if (result is not null)
        {
            return new Error()
            {
                Message =
                "Already exists"
            };
        }

        var newFav = new UserFavourite
        {
            PropertyId = propertyId,
            UserId = userId
        };

        await _dbContext.UserFavourites.AddAsync(newFav);
        var rows = await _dbContext.SaveChangesAsync();
        if (rows == 0)
        {
            return new Error
            {
                Message = "Couldn't add"
            };
        }
        return null;
    }

    public async Task<Error?> DeleteFavourite(long propertyId, string userId)
    {
        var result = await _dbContext.UserFavourites.Where(f => f.UserId == userId && f.PropertyId == propertyId).FirstOrDefaultAsync();
        if (result is null)
        {
            return new Error()
            {
                Message =
                "Property is not in user's favourites"
            };
        }

        _dbContext.UserFavourites.Remove(result);
        var rows = await _dbContext.SaveChangesAsync();
        if (rows == 0)
        {
            return new Error
            {
                Message = "Couldn't delete"
            };
        }
        return null;


    }

    public async Task<PaginatedResult<PropertyPost>> GetRecentProperties(int pageSz = 10, int page = 1, string? userId = null)
    {
        var query = _dbContext.Properties
        .Include(p => p.Images)
        .Include(p => p.User)
        .Include(p => p.Location)
        .OrderByDescending(p => p.CreatedAt)
        .AsQueryable();



        var count = await query.CountAsync();
        query = query.Skip((page - 1) * pageSz)
        .Take(pageSz)
        .AsNoTracking();

        var result = new List<PropertyPost>();
        if (userId is null)
        {
            result = await query.ToListAsync();
        }
        else
        {
            var q2 = await query.Select(p => new
            {
                p,
                hasFav = p.Favourites.Any(f => f.UserId == userId)
            }).ToListAsync();
            foreach (var item in q2)
            {
                item.p.IsFavorited = item.hasFav;
                result.Add(item.p);
            }

        }


        return new PaginatedResult<PropertyPost>
        {
            Results = result,
            Page = page,
            PageSize = pageSz,
            TotalResults = count,
            TotalPages = (int)Math.Ceiling(count / (double)pageSz)
        };
    }
    public async Task<Error?> DeleteProperty(long pid)
    {
        try
        {
            var property = await _dbContext.Properties.FindAsync(pid);
            _dbContext.Properties.Remove(property!);
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

    public async Task<PaginatedResult<PropertyPost>> GetPropertiesForUser(string ownerId, int page = 1, int pageSize = 10, string? visitorId = null)
    {
        var result = _dbContext.Properties.Where(p => p.UserId == ownerId)
        .Include(p => p.Images)
        .Include(p => p.Location)
        .Include(p => p.User)
        .OrderByDescending(p => p.CreatedAt)
        .AsNoTracking();



        var count = await result.CountAsync();

        var q = result.Skip((page - 1) * pageSize).Take(pageSize);
        var res = new List<PropertyPost>();

        if (visitorId is null)
        {
            res = await q.ToListAsync();
        }
        else
        {
            var q2 = await q.Select(p => new
            {
                p,
                hasFav = p.Favourites.Any(f => f.UserId == visitorId)
            }).ToListAsync();
            foreach (var item in q2)
            {
                item.p.IsFavorited = item.hasFav;
                res.Add(item.p);
            }

        }
        return new PaginatedResult<PropertyPost>
        {
            Results = res,
            Page = page,
            PageSize = pageSize,
            TotalResults = count,
            TotalPages = (int)Math.Ceiling(count / (double)pageSize)
        };
    }




    public async Task<PaginatedResult<PropertyPost>> Search(PropertySearchDTO searchDTO, string? userId = null)
    {
        var query = _dbContext.Locations
        .Include(l => l.Property)
        .ThenInclude(p => p!.Images)
        .Include(l => l.Property)
        .ThenInclude(p => p!.Location)
        .Include(l => l.Property)
        .ThenInclude(p => p!.User)
        .AsQueryable();
        if (searchDTO.Governorate is not null)
        {
            query = query.Where(l => l.Governorate == searchDTO.Governorate);
        }
        if (searchDTO.City is not null)
        {
            query = query.Where(l => l.City == searchDTO.City);
        }
        if (searchDTO.Street is not null)
        {
            query = query.Where(l => l.Street == searchDTO.Street);
        }
        if (searchDTO.MinPrice is not null)
        {
            query = query.Where(l => l.Property!.Price >= searchDTO.MinPrice);
        }
        if (searchDTO.MaxPrice is not null)
        {
            query = query.Where(l => l.Property!.Price <= searchDTO.MaxPrice);
        }
        if (searchDTO.PropertyType is not null)
        {
            query = query.Where(l => l.Property!.PropertyType == searchDTO.PropertyType);
        }
        if (searchDTO.MinBathrooms is not null)
        {
            query = query.Where(l => l.Property!.NumberOfBathrooms != null && l.Property!.NumberOfBathrooms >= searchDTO.MinBathrooms);
        }
        if (searchDTO.MinBedrooms is not null)
        {
            query = query.Where(l => l.Property!.NumberOfBedrooms != null && l.Property!.NumberOfBedrooms >= searchDTO.MinBedrooms);
        }
        if (searchDTO.PropertyCategory is not null)
        {
            query = query.Where(l => l.Property!.Category != null && searchDTO.PropertyCategory == l.Property.Category);
        }
        if (searchDTO.HasAirConditioning)
        {
            query = query.Where(l => l.Property!.HasAirConditioning == true);
        }
        if (searchDTO.HasGarage)
        {
            query = query.Where(l => l.Property!.HasGarage == true);
        }
        if (searchDTO.HasGarden)
        {
            query = query.Where(l => l.Property!.HasGarden == true);
        }
        if (searchDTO.HasSwimmingPool)
        {
            query = query.Where(l => l.Property!.HasSwimmingPool == true);
        }

        var src = query.Select(l => l.Property!);
        var count = await query.CountAsync();
        var q = src
        .OrderByDescending(p => p.CreatedAt)
        .Skip((searchDTO.PageNumber - 1) * searchDTO.PageSize)
        .Take(searchDTO.PageSize)
        .AsNoTracking();

        var result = new List<PropertyPost>();
        if (userId is null)
        {
            result = await q.ToListAsync();
        }
        else
        {
            var q2 = await q.Select(p => new
            {
                p,
                hasFav = p.Favourites.Any(f => f.UserId == userId)
            }).ToListAsync();
            foreach (var item in q2)
            {
                item.p.IsFavorited = item.hasFav;
                result.Add(item.p);
            }

        }

        return new PaginatedResult<PropertyPost>
        {
            Results = result,
            Page = searchDTO.PageNumber,
            PageSize = searchDTO.PageSize,
            TotalResults = count,
            TotalPages = (int)Math.Ceiling(count / (double)searchDTO.PageSize)
        };
    }
}
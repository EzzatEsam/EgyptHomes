using EgyptHomes.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace EgyptHomes.Services;
public class ApplicationDbContext : IdentityDbContext<User>
{
    public DbSet<PropertyPost> Properties { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<PropertyImage> PropertyImages { get; set; }
    public DbSet<UserFavourite> UserFavourites { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<PropertyPost>().Property(p => p.PropertyType).HasConversion<int>();
        builder.Entity<PropertyPost>().Property(p => p.Category).HasConversion<int>();

        base.OnModelCreating(builder);
    }

    public override int SaveChanges()
    {
        UpdateTimeStamps();
        return base.SaveChanges();
    }


    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimeStamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimeStamps()
    {
        var now = DateTime.UtcNow;

        foreach (var item in ChangeTracker.Entries())
        {
            if (item.Entity is BaseModel model)
            {
                switch (item.State)
                {
                    case EntityState.Added:
                        model.CreatedAt = now;
                        model.UpdatedAt = now;
                        break;

                    case EntityState.Modified:
                        model.UpdatedAt = now;
                        break;
                }
            }
        }
    }
}
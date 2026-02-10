using backend.Models;
using backend.Models.Cities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace backend.Data
{
    public class UserDbContext : IdentityDbContext<ApplicationUser>
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
        {
        }

        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<City> Cities { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<RefreshToken>().HasIndex(rt => rt.Token).IsUnique();

            builder.Entity<City>(entity =>
            {
                entity.Property(e => e.PostalCode)
                      .HasColumnType("char(4)");

                entity.HasIndex(e => new { e.CityName, e.PostalCode })
                      .IsUnique();
            });
        }
    }
}

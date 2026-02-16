using backend.Models;
using backend.Models.Cities;
using backend.Models.Preferances;
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

        public DbSet<Preference> Preferences { get; set; }

        public DbSet<PreferenceGroup> PreferenceGroups { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Preference>()
                .HasOne(p => p.PreferenceGroup).WithMany(g => g.Preferences).HasForeignKey(p=>p.PreferenceGroupId);

            builder.Entity<UserPreference>()
                .HasKey(up => new { up.UserId, up.PreferenceId });

            builder.Entity<UserPreference>()
                .HasOne(up => up.User)
                .WithMany()
                .HasForeignKey(up => up.UserId);

            builder.Entity<UserPreference>()
                .HasOne(up => up.Preference)
                .WithMany()
                .HasForeignKey(up => up.PreferenceId);

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

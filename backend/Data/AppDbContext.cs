using backend.Models;
using backend.Models.Chat;
using backend.Models.Cities;
using backend.Models.Preferances;
using backend.Modules.CoursesBase.Models;
using backend.Modules.Engagement.Models;
using backend.Modules.Identity.Models;
using backend.Modules.LearningPathTemplate.Models;
using backend.Modules.Payment.Models;
using backend.Modules.Progression.Models;
using backend.Modules.Resources.Models;
using backend.Modules.Scheduling.Models;
using backend.Modules.Shared.Models;
using backend.Modules.Tutoring.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace backend.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public DbSet<City> Cities { get; set; }

        public DbSet<Preference> Preferences { get; set; }
        public DbSet<PreferenceGroup> PreferenceGroups { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }

        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Qualification> Qualifications { get; set; }
        public DbSet<CourseBaseModel> CourseBases { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<CourseLevel> CourseLevels { get; set; }
        public DbSet<CourseDomain> CourseDomains { get; set; }
        public DbSet<CourseTag> CourseTags { get; set; }
        public DbSet<CourseToTag> CoursesToTags { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<CourseToLanguage> CoursesToLanguages { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Unit> LearningPathUnits { get; set; }
        public DbSet<UnitLesson> LearningPathUnitLessons { get; set; }
        public DbSet<LessonToContent> LearningPathLessonsToContents { get; set; }
        public DbSet<TutoringWall> TutoringWalls { get; set; }
        public DbSet<TutoringWallPost> TutoringWallPosts { get; set; }
        public DbSet<WallPostAttachment> WallPostAttachments { get; set; }
        public DbSet<PathEnrollment> PathEnrollments { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<TokenTransaction> TokenTransactions { get; set; }
        public DbSet<Folder> Folders { get; set; }
        public DbSet<ContentItem> ContentItems { get; set; }
        public DbSet<PhysicalFile> PhysicalFiles { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<TestModule> TestModules { get; set; }
        public DbSet<TestModuleAnswer> TestModuleAnswers { get; set; }
        public DbSet<HandIn> HandIns { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<SubmissionAttachment> SubmissionAttachments { get; set; }
        public DbSet<HandInFeedback> HandInFeedbacks { get; set; }
        public DbSet<CourseReview> CourseReviews { get; set; }
        public DbSet<ChatRoom> ChatRooms { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<CommunityThread> CommunityThreads { get; set; }
        public DbSet<CommunityMessage> CommunityMessages { get; set; }
        public DbSet<Notification> Notifications { get; set; }




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


            builder.Entity<ConversationParticipant>()
                .HasOne(cp => cp.Conversation)
                .WithMany(c => c.ConversationParticipants)
                .HasForeignKey(cp=>cp.ConversationId);

            builder.Entity<ConversationParticipant>()
                .HasOne(cp => cp.User)
                .WithMany()
                .HasForeignKey(cp => cp.UserId);

            builder.Entity<Message>()
                .HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId);

            builder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId);


            builder.Entity<RefreshToken>().HasIndex(rt => rt.Token).IsUnique();

            builder.Entity<City>(entity =>
            {
                entity.Property(e => e.PostalCode)
                      .HasColumnType("char(4)");

                entity.HasIndex(e => new { e.CityName, e.PostalCode })
                      .IsUnique();
            });

            builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<ModelBase>())
            {
                if (entry.State == EntityState.Added)
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                if (entry.State == EntityState.Modified)
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}

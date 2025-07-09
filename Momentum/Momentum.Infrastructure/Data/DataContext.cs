using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Momentum.Domain.Entities.Achievements;
using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Entities.Habits;

namespace Momentum.Infrastructure.Data;

public class DataContext(DbContextOptions<DataContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<Habit> Habits { get; set; }
    public DbSet<Reminder> Reminders { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<HabitEntry> HabitEntries { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<UserAchievement> UserAchievements { get; set; }
    public DbSet<HabitGoal> HabitGoals { get; set; }
    public DbSet<HabitSchedule> HabitSchedules { get; set; }

    /// <summary>
    ///     This method is called when the model for a derived context is being created.
    /// </summary>
    /// <param name="builder">The builder used to construct the model for this context.</param>
    protected override void OnModelCreating(ModelBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        base.OnModelCreating(builder);

        // Apply all configurations automatically
        builder.ApplyConfigurationsFromAssembly(typeof(DataContext).Assembly);
    }
}

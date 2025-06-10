using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Momentum.Domain.Entities.Auth;
using Momentum.Domain.Entities;
using Momentum.Domain.Entities.Habits;

namespace Momentum.Infrastructure.Data;

public class DataContext(DbContextOptions<DataContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<Habit> Habits { get; set; }
    public DbSet<Reminder> Reminders { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<HabitEntry> HabitEntries { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        base.OnModelCreating(builder);

        // Apply all configurations automatically
        builder.ApplyConfigurationsFromAssembly(typeof(DataContext).Assembly);
    }
}

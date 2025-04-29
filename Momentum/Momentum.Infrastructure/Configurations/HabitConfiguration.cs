using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Habits;

namespace Momentum.Infrastructure.Configurations;

public class HabitConfiguration : IEntityTypeConfiguration<Habit>
{
    // ReSharper disable once TooManyDeclarations
    public void Configure(EntityTypeBuilder<Habit> builder)
    {
        Guard.Against.Null(builder, nameof(builder));

        builder.Property(h => h.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(h => h.Description)
            .HasMaxLength(500);

        builder.Property(h => h.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Habits;

namespace Momentum.Infrastructure.Configurations;

public class ReminderConfiguration : IEntityTypeConfiguration<Reminder>
{
    public void Configure(EntityTypeBuilder<Reminder> builder)
    {
        Guard.Against.Null(builder, nameof(builder));

        builder.HasOne(x => x.HabitEntry)
            .WithMany(x => x.Reminders)
            .HasForeignKey(x => x.HabitEntryId)
            .IsRequired();

        builder.Property(x => x.DayOfWeek)
            .HasConversion<string>()
            .IsRequired(false);

        builder.Property(x => x.Message)
            .HasMaxLength(200)
            .IsRequired(false);

        builder.Property(x => x.ReminderTime)
            .IsRequired();
    }
}

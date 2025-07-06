using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Habits;

namespace Momentum.Infrastructure.Configurations;

public class ReminderConfiguration : IEntityTypeConfiguration<Reminder>
{
	public void Configure(EntityTypeBuilder<Reminder> builder)
	{
		Guard.Against.Null(builder, nameof(builder));

		builder.HasIndex(x => x.HabitEntryId);

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

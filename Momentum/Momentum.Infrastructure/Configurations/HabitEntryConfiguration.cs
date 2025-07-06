using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Habits;

namespace Momentum.Infrastructure.Configurations;

public class HabitEntryConfiguration : IEntityTypeConfiguration<HabitEntry>
{
	public void Configure(EntityTypeBuilder<HabitEntry> builder)
	{
		Guard.Against.Null(builder, nameof(builder));

		builder.Property(x => x.Date)
				.IsRequired();

		builder.Property(x => x.Completed)
				.IsRequired()
				.HasDefaultValue(false);

		builder.Property(x => x.Note)
				.HasMaxLength(500);

		builder.HasIndex(x => x.HabitId);
	}
}

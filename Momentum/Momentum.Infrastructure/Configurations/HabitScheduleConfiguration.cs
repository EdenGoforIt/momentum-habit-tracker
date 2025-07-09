using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Habits;

namespace Momentum.Infrastructure.Configurations
{
    public class HabitScheduleConfiguration : IEntityTypeConfiguration<HabitSchedule>
    {
        public void Configure(EntityTypeBuilder<HabitSchedule> builder)
        {
            Guard.Against.Null(builder, nameof(builder));
            builder.HasKey(hs => hs.Id);
            builder.Property(hs => hs.CustomDays).HasMaxLength(100);
            builder.Property(hs => hs.TimeZone).HasMaxLength(50);
            builder.Property(hs => hs.StartDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
            builder.Property(hs => hs.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            builder.Property(hs => hs.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            builder.Property(hs => hs.HabitId).IsRequired();
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Statistics;

namespace Momentum.Infrastructure.Configurations;

public class HabitStatisticsConfiguration : IEntityTypeConfiguration<HabitStatistics>
{
    public void Configure(EntityTypeBuilder<HabitStatistics> builder)
    {
        Guard.Against.Null(builder, nameof(builder));
        builder.HasKey(hs => hs.Id);
        builder.Property(hs => hs.HabitId).IsRequired();
        builder.Property(hs => hs.MostActiveDay).HasMaxLength(20);
        builder.Property(hs => hs.MostActiveTimeOfDay).HasMaxLength(20);
        builder.Property(hs => hs.LastCalculated).HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(hs => hs.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}

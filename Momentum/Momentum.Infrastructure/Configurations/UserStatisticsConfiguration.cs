using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Statistics;

namespace Momentum.Infrastructure.Configurations;

public class UserStatisticsConfiguration : IEntityTypeConfiguration<UserStatistics>
{
    public void Configure(EntityTypeBuilder<UserStatistics> builder)
    {
        Guard.Against.Null(builder, nameof(builder));
        builder.HasKey(us => us.Id);
        builder.Property(us => us.UserId).IsRequired();
        builder.Property(us => us.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(us => us.LastUpdated).HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}

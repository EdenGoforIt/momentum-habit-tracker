using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Achievements;

namespace Momentum.Infrastructure.Configurations;

public class AchievementConfiguration : IEntityTypeConfiguration<Achievement>
{
    public void Configure(EntityTypeBuilder<Achievement> builder)
    {
        Guard.Against.Null(builder, nameof(builder));
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Name).IsRequired().HasMaxLength(100);
        builder.Property(a => a.Description).HasMaxLength(500);
        builder.Property(a => a.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}

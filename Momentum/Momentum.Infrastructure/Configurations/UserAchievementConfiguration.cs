using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Achievements;

namespace Momentum.Infrastructure.Configurations;

public class UserAchievementConfiguration : IEntityTypeConfiguration<UserAchievement>
{
    public void Configure(EntityTypeBuilder<UserAchievement> builder)
    {
        Guard.Against.Null(builder, nameof(builder));
        builder.HasKey(ua => ua.Id);
        builder.Property(ua => ua.UserId).IsRequired();
        builder.Property(ua => ua.AchievementId).IsRequired();
    }
}

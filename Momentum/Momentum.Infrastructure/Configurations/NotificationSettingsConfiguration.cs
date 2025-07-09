using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Notifications;

namespace Momentum.Infrastructure.Configurations;

public class NotificationSettingsConfiguration : IEntityTypeConfiguration<NotificationSettings>
{
    public void Configure(EntityTypeBuilder<NotificationSettings> builder)
    {
        Guard.Against.Null(builder, nameof(builder));
        builder.HasKey(ns => ns.Id);
        builder.Property(ns => ns.UserId).IsRequired();
        builder.Property(ns => ns.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(ns => ns.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}

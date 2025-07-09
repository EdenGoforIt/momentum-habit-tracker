using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Users;

namespace Momentum.Infrastructure.Configurations;

public class UserPreferencesConfiguration : IEntityTypeConfiguration<UserPreferences>
{
    public void Configure(EntityTypeBuilder<UserPreferences> builder)
    {
        Guard.Against.Null(builder, nameof(builder));
        builder.HasKey(up => up.Id);
        builder.Property(up => up.UserId).IsRequired();
        builder.Property(up => up.Theme).HasMaxLength(50);
        builder.Property(up => up.DateFormat).HasMaxLength(20);
        builder.Property(up => up.TimeFormat).HasMaxLength(5);
        builder.Property(up => up.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.Property(up => up.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}

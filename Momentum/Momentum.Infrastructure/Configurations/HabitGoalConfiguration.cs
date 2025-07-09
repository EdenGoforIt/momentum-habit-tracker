using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Habits;

namespace Momentum.Infrastructure.Configurations
{
    public class HabitGoalConfiguration : IEntityTypeConfiguration<HabitGoal>
    {
        public void Configure(EntityTypeBuilder<HabitGoal> builder)
        {
            Guard.Against.Null(builder, nameof(builder));
            builder.HasKey(hg => hg.Id);
            builder.Property(hg => hg.Title).IsRequired().HasMaxLength(100);
            builder.Property(hg => hg.Description).HasMaxLength(500);
            builder.Property(hg => hg.StartDate).HasDefaultValueSql("CURRENT_TIMESTAMP");
            builder.Property(hg => hg.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            builder.Property(hg => hg.HabitId).IsRequired();
        }
    }
}

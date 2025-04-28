using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities.Habits;

namespace Momentum.Infrastructure.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    // ReSharper disable once TooManyDeclarations
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        Guard.Against.Null(builder);

        builder.Property(p => p.Name)
            .IsRequired()
            .HasMaxLength(100);
        builder.HasMany(p => p.Habits)
            .WithOne(p => p.Category)
            .HasForeignKey(p => p.CategoryId);
    }
}

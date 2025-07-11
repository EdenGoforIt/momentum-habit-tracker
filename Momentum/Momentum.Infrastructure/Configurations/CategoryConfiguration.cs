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
        
        // Seed default categories
        builder.HasData(
            new Category
            {
                Id = 1,
                Name = "Health",
                Description = "Habits for physical and mental well-being",
                IconName = "health_icon",
                Color = "#4CAF50",
                SortOrder = 1,
                IsSystem = true,
                IsActive = true,
                CreatedAt = new DateTime(2025, 7, 10),
            },
            new Category
            {
                Id = 2,
                Name = "Productivity",
                Description = "Habits to boost productivity",
                IconName = "productivity_icon",
                Color = "#2196F3",
                SortOrder = 2,
                IsSystem = true,
                IsActive = true,
                CreatedAt = new DateTime(2025, 7, 10),
            },
            new Category
            {
                Id = 3,
                Name = "Learning",
                Description = "Habits for personal growth and learning",
                IconName = "learning_icon",
                Color = "#FFC107",
                SortOrder = 3,
                IsSystem = true,
                IsActive = true,
                CreatedAt = new DateTime(2025, 7, 10),
            },
            new Category
            {
                Id = 4,
                Name = "Finance",
                Description = "Habits for managing money and financial growth",
                IconName = "finance_icon",
                Color = "#8BC34A",
                SortOrder = 4,
                IsSystem = true,
                IsActive = true,
                CreatedAt = new DateTime(2025, 7, 10),
            },
            new Category
            {
                Id = 5,
                Name = "Fitness",
                Description = "Physical exercise and activity habits",
                IconName = "fitness_icon",
                Color = "#E91E63",
                SortOrder = 5,
                IsSystem = true,
                IsActive = true,
                CreatedAt = new DateTime(2025, 7, 10),
            },
            new Category
            {
                Id = 6,
                Name = "Mindfulness",
                Description = "Habits for meditation and mental clarity",
                IconName = "mindfulness_icon",
                Color = "#9C27B0",
                SortOrder = 6,
                IsSystem = true,
                IsActive = true,
                CreatedAt = new DateTime(2025, 7, 10),
            },
            new Category
            {
                Id = 7,
                Name = "Relationships",
                Description = "Habits to improve social connections",
                IconName = "relationships_icon",
                Color = "#FF9800",
                SortOrder = 7,
                IsSystem = true,
                IsActive = true,
                CreatedAt = new DateTime(2025, 7, 10),
            },
            new Category
            {
                Id = 8,
                Name = "Creativity",
                Description = "Habits to boost creative skills",
                IconName = "creativity_icon",
                Color = "#00BCD4",
                SortOrder = 8,
                IsSystem = true,
                IsActive = true,
                CreatedAt = new DateTime(2025, 7, 10),
            },
            new Category
            {
                Id = 9,
                Name = "Self-Care",
                Description = "Habits for personal well-being and care",
                IconName = "selfcare_icon",
                Color = "#607D8B",
                SortOrder = 9,
                IsSystem = true,
                IsActive = true,
                CreatedAt = new DateTime(2025, 7, 10),
            },
            new Category
            {
                Id = 10,
                Name = "Organization",
                Description = "Habits for staying organized and tidy",
                IconName = "organization_icon",
                Color = "#795548",
                SortOrder = 10,
                IsSystem = true,
                IsActive = true,
                CreatedAt = new DateTime(2025, 7, 10),
            }
        );
    }
}

using Momentum.Domain.Enums;

namespace Momentum.Domain.Entities.Achievements;

public class Achievement
{
    public required long Id { get; init; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public string? IconName { get; set; } // For UI display
    public string? BadgeColor { get; set; } // Hex color code

    // Achievement criteria
    public required AchievementType Type { get; set; }
    public required int RequiredValue { get; set; } // e.g., 7 for "7-day streak"
    public string? AdditionalCriteria { get; set; } // JSON string for complex criteria

    // Metadata
    public int Points { get; set; } // Points awarded for earning this achievement
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

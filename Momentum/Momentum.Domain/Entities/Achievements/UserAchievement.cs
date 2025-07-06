using Momentum.Domain.Entities.Auth;

namespace Momentum.Domain.Entities.Achievements;

public class UserAchievement
{
	public required long Id { get; init; }

	// User and Achievement references
	public required string UserId { get; init; }
	// Note: User navigation removed to prevent performance issues

	public required long AchievementId { get; init; }
	// Note: Achievement navigation removed to prevent performance issues

	// Achievement details
	public DateTime EarnedDate { get; set; } = DateTime.UtcNow;
	public bool IsViewed { get; set; } // Whether user has seen the achievement notification
	public string? EarnedContext { get; set; } // Additional context about how it was earned

	// Progress tracking (for multi-step achievements)
	public int CurrentProgress { get; set; }
	public bool IsInProgress { get; set; } = true;
	public DateTime? CompletedDate { get; set; }
}

# Momentum Database Schema

## Overview

This document outlines the database schema for the Momentum habit tracking application. The database uses Entity Framework Core with a relational database structure.

## Tables

### Users (AspNetUsers)

_Extends IdentityUser from ASP.NET Core Identity_

| Column               | Type            | Constraints | Description                          |
| -------------------- | --------------- | ----------- | ------------------------------------ |
| Id                   | string          | PK          | User unique identifier               |
| FirstName            | string          | NOT NULL    | User's first name                    |
| LastName             | string          | NOT NULL    | User's last name                     |
| DateOfBirth          | DateTime?       | NULL        | User's date of birth                 |
| UserName             | string          | NOT NULL    | Username for login                   |
| NormalizedUserName   | string          | NOT NULL    | Normalized username for searches     |
| Email                | string          | NOT NULL    | User's email address                 |
| NormalizedEmail      | string          | NOT NULL    | Normalized email for searches        |
| EmailConfirmed       | bool            | NOT NULL    | Email confirmation status            |
| PasswordHash         | string          | NULL        | Hashed password                      |
| SecurityStamp        | string          | NULL        | Security stamp for security purposes |
| ConcurrencyStamp     | string          | NULL        | Concurrency stamp                    |
| PhoneNumber          | string          | NULL        | User's phone number                  |
| PhoneNumberConfirmed | bool            | NOT NULL    | Phone confirmation status            |
| TwoFactorEnabled     | bool            | NOT NULL    | 2FA enabled status                   |
| LockoutEnd           | DateTimeOffset? | NULL        | Lockout end date                     |
| LockoutEnabled       | bool            | NOT NULL    | Lockout enabled status               |
| AccessFailedCount    | int             | NOT NULL    | Failed access attempts count         |

### Categories

_Predefined and custom habit categories_

| Column      | Type     | Constraints              | Description            |
| ----------- | -------- | ------------------------ | ---------------------- |
| Id          | bigint   | PK, IDENTITY             | Category identifier    |
| Name        | string   | NOT NULL, UNIQUE         | Category name          |
| Description | string   | NULL                     | Category description   |
| IconName    | string   | NULL                     | Icon identifier for UI |
| Color       | string   | NULL                     | Hex color code         |
| SortOrder   | int      | NOT NULL, DEFAULT(0)     | Display order          |
| IsSystem    | bool     | NOT NULL, DEFAULT(false) | System vs user-created |
| IsActive    | bool     | NOT NULL, DEFAULT(true)  | Active status          |
| CreatedAt   | DateTime | NOT NULL                 | Creation timestamp     |

### Habits

_Core habit tracking entities_

| Column                | Type       | Constraints              | Description                    |
| --------------------- | ---------- | ------------------------ | ------------------------------ |
| Id                    | bigint     | PK, IDENTITY             | Habit identifier               |
| Name                  | string     | NOT NULL                 | Habit name                     |
| Description           | string     | NULL                     | Habit description              |
| Frequency             | int (enum) | NOT NULL                 | Daily, Weekly, Monthly, Yearly |
| IconName              | string     | NULL                     | Icon identifier for UI         |
| Color                 | string     | NULL                     | Hex color code for theming     |
| Priority              | int        | NOT NULL, DEFAULT(1)     | 1=High, 2=Medium, 3=Low        |
| DifficultyLevel       | int        | NOT NULL, DEFAULT(1)     | 1-5 scale                      |
| StartDate             | DateTime?  | NULL                     | Habit start date               |
| EndDate               | DateTime?  | NULL                     | Habit end date                 |
| PreferredTime         | TimeSpan?  | NULL                     | Preferred completion time      |
| IsPublic              | bool       | NOT NULL, DEFAULT(false) | Public sharing status          |
| NotificationsEnabled  | bool       | NOT NULL, DEFAULT(true)  | Notification status            |
| ReminderMinutesBefore | int        | NOT NULL, DEFAULT(15)    | Reminder timing                |
| SortOrder             | int        | NOT NULL, DEFAULT(0)     | Display order                  |
| Notes                 | string     | NULL                     | Private notes                  |
| CreatedAt             | DateTime   | NOT NULL                 | Creation timestamp             |
| ArchivedAt            | DateTime?  | NULL                     | Archive timestamp              |
| UserId                | string     | FK, NOT NULL             | User reference                 |
| CategoryId            | bigint?    | FK, NULL                 | Category reference             |

**Indexes:**

- IX_Habits_UserId (Non-clustered)
- IX_Habits_CategoryId (Non-clustered)
- IX_Habits_CreatedAt (Non-clustered)

### HabitEntries

_Daily habit completion records_

| Column           | Type      | Constraints              | Description              |
| ---------------- | --------- | ------------------------ | ------------------------ |
| Id               | bigint    | PK, IDENTITY             | Entry identifier         |
| Date             | DateTime  | NOT NULL                 | Entry date               |
| Completed        | bool      | NOT NULL, DEFAULT(false) | Completion status        |
| CompletedAt      | DateTime? | NULL                     | Completion timestamp     |
| DifficultyRating | int?      | NULL                     | 1-5 difficulty rating    |
| MoodBefore       | int?      | NULL                     | 1-10 mood rating before  |
| MoodAfter        | int?      | NULL                     | 1-10 mood rating after   |
| Duration         | TimeSpan? | NULL                     | Time spent on habit      |
| Location         | string    | NULL                     | Location where performed |
| Note             | string    | NULL                     | Entry notes              |
| CreatedAt        | DateTime  | NOT NULL                 | Creation timestamp       |
| UpdatedAt        | DateTime  | NOT NULL                 | Last update timestamp    |
| HabitId          | bigint    | FK, NOT NULL             | Habit reference          |

**Indexes:**

- IX_HabitEntries_HabitId (Non-clustered)
- IX_HabitEntries_Date (Non-clustered)
- IX_HabitEntries_HabitId_Date (Unique, Composite)

### HabitGoals

_Goal tracking for habits_

| Column          | Type       | Constraints              | Description                                                 |
| --------------- | ---------- | ------------------------ | ----------------------------------------------------------- |
| Id              | bigint     | PK, IDENTITY             | Goal identifier                                             |
| Title           | string     | NOT NULL                 | Goal title                                                  |
| Description     | string     | NULL                     | Goal description                                            |
| TargetValue     | int        | NOT NULL                 | Target value to achieve                                     |
| Type            | int (enum) | NOT NULL                 | Streak, TotalCompletions, ConsistencyRate, Duration, Custom |
| Timeframe       | int (enum) | NOT NULL                 | Daily, Weekly, Monthly, Quarterly, Yearly, Custom           |
| CurrentProgress | int        | NOT NULL, DEFAULT(0)     | Current progress value                                      |
| IsCompleted     | bool       | NOT NULL, DEFAULT(false) | Completion status                                           |
| CompletedDate   | DateTime?  | NULL                     | Completion date                                             |
| StartDate       | DateTime   | NOT NULL                 | Goal start date                                             |
| EndDate         | DateTime?  | NULL                     | Goal end date                                               |
| CreatedAt       | DateTime   | NOT NULL                 | Creation timestamp                                          |
| HabitId         | bigint     | FK, NOT NULL             | Habit reference                                             |

**Indexes:**

- IX_HabitGoals_HabitId (Non-clustered)

### HabitSchedules

_Custom scheduling configuration for habits_

| Column              | Type      | Constraints              | Description                         |
| ------------------- | --------- | ------------------------ | ----------------------------------- |
| Id                  | bigint    | PK, IDENTITY             | Schedule identifier                 |
| StartDate           | DateTime  | NOT NULL                 | Schedule start date                 |
| EndDate             | DateTime? | NULL                     | Schedule end date                   |
| IsActive            | bool      | NOT NULL, DEFAULT(true)  | Active status                       |
| CustomDays          | string    | NULL                     | JSON array of selected days [1,3,5] |
| PreferredTime       | TimeSpan? | NULL                     | Preferred time of day               |
| MaxDailyCompletions | int?      | NULL, DEFAULT(1)         | Max completions per day             |
| SkipWeekends        | bool      | NOT NULL, DEFAULT(false) | Skip weekend days                   |
| SkipHolidays        | bool      | NOT NULL, DEFAULT(false) | Skip holidays                       |
| TimeZone            | string    | NULL                     | User timezone                       |
| CreatedAt           | DateTime  | NOT NULL                 | Creation timestamp                  |
| UpdatedAt           | DateTime  | NOT NULL                 | Last update timestamp               |
| HabitId             | bigint    | FK, NOT NULL             | Habit reference                     |

**Indexes:**

- IX_HabitSchedules_HabitId (Non-clustered)

### Reminders

_Reminder configuration for habit entries_

| Column       | Type        | Constraints                                   | Description              |
| ------------ | ----------- | --------------------------------------------- | ------------------------ |
| Id           | bigint      | PK, IDENTITY                                  | Reminder identifier      |
| HabitEntryId | bigint      | FK, NOT NULL                                  | Habit entry reference    |
| ReminderTime | TimeSpan    | NOT NULL                                      | Time of day for reminder |
| DayOfWeek    | int? (enum) | NULL                                          | Day for weekly reminders |
| Message      | string      | NOT NULL, DEFAULT('Don't forget your habit!') | Reminder message         |

**Indexes:**

- IX_Reminders_HabitEntryId (Non-clustered)

### HabitStatistics

_Calculated statistics per habit_

| Column                | Type      | Constraints          | Description                |
| --------------------- | --------- | -------------------- | -------------------------- |
| Id                    | bigint    | PK, IDENTITY         | Statistics identifier      |
| TotalCompletions      | int       | NOT NULL, DEFAULT(0) | Total completions count    |
| TotalEntries          | int       | NOT NULL, DEFAULT(0) | Total entries count        |
| CompletionRate        | float     | NOT NULL, DEFAULT(0) | Completion percentage      |
| CurrentStreak         | int       | NOT NULL, DEFAULT(0) | Current streak days        |
| LongestStreak         | int       | NOT NULL, DEFAULT(0) | Longest streak achieved    |
| LastCompletionDate    | DateTime? | NULL                 | Last completion date       |
| StreakStartDate       | DateTime? | NULL                 | Current streak start       |
| CompletionsThisWeek   | int       | NOT NULL, DEFAULT(0) | Weekly completions         |
| CompletionsThisMonth  | int       | NOT NULL, DEFAULT(0) | Monthly completions        |
| CompletionsThisYear   | int       | NOT NULL, DEFAULT(0) | Yearly completions         |
| WeeklyCompletionRate  | float     | NOT NULL, DEFAULT(0) | Weekly completion rate     |
| MonthlyCompletionRate | float     | NOT NULL, DEFAULT(0) | Monthly completion rate    |
| MissedDays            | int       | NOT NULL, DEFAULT(0) | Total missed days          |
| ConsecutiveMissedDays | int       | NOT NULL, DEFAULT(0) | Consecutive missed days    |
| AverageCompletionTime | TimeSpan? | NULL                 | Average completion time    |
| BestCompletionTime    | TimeSpan? | NULL                 | Best completion time       |
| MostActiveDay         | string    | NULL                 | Most active day of week    |
| MostActiveTimeOfDay   | string    | NULL                 | Most active time period    |
| LastCalculated        | DateTime  | NOT NULL             | Last calculation timestamp |
| CreatedAt             | DateTime  | NOT NULL             | Creation timestamp         |
| HabitId               | bigint    | FK, NOT NULL, UNIQUE | Habit reference            |

**Indexes:**

- IX_HabitStatistics_HabitId (Unique, Non-clustered)

### UserStatistics

_Overall user statistics_

| Column                 | Type      | Constraints          | Description               |
| ---------------------- | --------- | -------------------- | ------------------------- |
| Id                     | bigint    | PK, IDENTITY         | Statistics identifier     |
| CurrentStreak          | int       | NOT NULL, DEFAULT(0) | Current overall streak    |
| LongestStreak          | int       | NOT NULL, DEFAULT(0) | Longest overall streak    |
| LastStreakDate         | DateTime? | NULL                 | Last streak date          |
| TotalHabitsCompleted   | int       | NOT NULL, DEFAULT(0) | Total habits completed    |
| TotalHabitsCreated     | int       | NOT NULL, DEFAULT(0) | Total habits created      |
| OverallCompletionRate  | float     | NOT NULL, DEFAULT(0) | Overall completion rate   |
| CompletionsThisWeek    | int       | NOT NULL, DEFAULT(0) | Weekly completions        |
| CompletionsThisMonth   | int       | NOT NULL, DEFAULT(0) | Monthly completions       |
| CompletionsThisYear    | int       | NOT NULL, DEFAULT(0) | Yearly completions        |
| ActiveHabits           | int       | NOT NULL, DEFAULT(0) | Active habits count       |
| ArchivedHabits         | int       | NOT NULL, DEFAULT(0) | Archived habits count     |
| FirstHabitCreated      | DateTime? | NULL                 | First habit creation date |
| ConsecutiveDaysActive  | int       | NOT NULL, DEFAULT(0) | Consecutive active days   |
| WeeklyConsistencyRate  | float     | NOT NULL, DEFAULT(0) | Weekly consistency        |
| MonthlyConsistencyRate | float     | NOT NULL, DEFAULT(0) | Monthly consistency       |
| BadgesEarned           | int       | NOT NULL, DEFAULT(0) | Badges earned count       |
| MilestonesReached      | int       | NOT NULL, DEFAULT(0) | Milestones reached        |
| LastUpdated            | DateTime  | NOT NULL             | Last update timestamp     |
| CreatedAt              | DateTime  | NOT NULL             | Creation timestamp        |
| UserId                 | string    | FK, NOT NULL, UNIQUE | User reference            |

**Indexes:**

- IX_UserStatistics_UserId (Unique, Non-clustered)

### Achievements

_Available achievements/badges_

| Column             | Type       | Constraints             | Description                 |
| ------------------ | ---------- | ----------------------- | --------------------------- |
| Id                 | bigint     | PK, IDENTITY            | Achievement identifier      |
| Name               | string     | NOT NULL                | Achievement name            |
| Description        | string     | NOT NULL                | Achievement description     |
| IconName           | string     | NULL                    | Icon identifier             |
| BadgeColor         | string     | NULL                    | Badge hex color             |
| Type               | int (enum) | NOT NULL                | Achievement type (see enum) |
| RequiredValue      | int        | NOT NULL                | Required value to earn      |
| AdditionalCriteria | string     | NULL                    | JSON for complex criteria   |
| Points             | int        | NOT NULL, DEFAULT(0)    | Points awarded              |
| IsActive           | bool       | NOT NULL, DEFAULT(true) | Active status               |
| SortOrder          | int        | NOT NULL, DEFAULT(0)    | Display order               |
| CreatedAt          | DateTime   | NOT NULL                | Creation timestamp          |

### UserAchievements

_User-earned achievements_

| Column          | Type      | Constraints              | Description                 |
| --------------- | --------- | ------------------------ | --------------------------- |
| Id              | bigint    | PK, IDENTITY             | User achievement identifier |
| UserId          | string    | FK, NOT NULL             | User reference              |
| AchievementId   | bigint    | FK, NOT NULL             | Achievement reference       |
| EarnedDate      | DateTime  | NOT NULL                 | Date earned                 |
| IsViewed        | bool      | NOT NULL, DEFAULT(false) | Viewed status               |
| EarnedContext   | string    | NULL                     | Context of earning          |
| CurrentProgress | int       | NOT NULL, DEFAULT(0)     | Progress for multi-step     |
| IsInProgress    | bool      | NOT NULL, DEFAULT(true)  | In progress status          |
| CompletedDate   | DateTime? | NULL                     | Completion date             |

**Indexes:**

- IX_UserAchievements_UserId (Non-clustered)
- IX_UserAchievements_AchievementId (Non-clustered)
- IX_UserAchievements_UserId_AchievementId (Unique, Composite)

### UserPreferences

_User app preferences_

| Column                    | Type     | Constraints                     | Description            |
| ------------------------- | -------- | ------------------------------- | ---------------------- |
| Id                        | bigint   | PK, IDENTITY                    | Preferences identifier |
| NotificationsEnabled      | bool     | NOT NULL, DEFAULT(true)         | Global notifications   |
| PushNotificationsEnabled  | bool     | NOT NULL, DEFAULT(true)         | Push notifications     |
| EmailNotificationsEnabled | bool     | NOT NULL, DEFAULT(false)        | Email notifications    |
| DarkModeEnabled           | bool     | NOT NULL, DEFAULT(false)        | Dark mode status       |
| Theme                     | string   | NOT NULL, DEFAULT('Default')    | Theme name             |
| WeekStartsOnMonday        | bool     | NOT NULL, DEFAULT(true)         | Week start preference  |
| DateFormat                | string   | NOT NULL, DEFAULT('MM/dd/yyyy') | Date format            |
| TimeFormat                | string   | NOT NULL, DEFAULT('12')         | 12 or 24 hour          |
| ShowCompletionPercentage  | bool     | NOT NULL, DEFAULT(true)         | Show percentages       |
| ShowStreaks               | bool     | NOT NULL, DEFAULT(true)         | Show streaks           |
| ReminderAdvanceMinutes    | int      | NOT NULL, DEFAULT(15)           | Reminder timing        |
| DataSharingEnabled        | bool     | NOT NULL, DEFAULT(false)        | Data sharing           |
| AnalyticsEnabled          | bool     | NOT NULL, DEFAULT(true)         | Analytics tracking     |
| CreatedAt                 | DateTime | NOT NULL                        | Creation timestamp     |
| UpdatedAt                 | DateTime | NOT NULL                        | Last update timestamp  |
| UserId                    | string   | FK, NOT NULL, UNIQUE            | User reference         |

**Indexes:**

- IX_UserPreferences_UserId (Unique, Non-clustered)

### NotificationSettings

_Detailed notification preferences_

| Column                           | Type      | Constraints              | Description           |
| -------------------------------- | --------- | ------------------------ | --------------------- |
| Id                               | bigint    | PK, IDENTITY             | Settings identifier   |
| GlobalNotificationsEnabled       | bool      | NOT NULL, DEFAULT(true)  | Global toggle         |
| PushNotificationsEnabled         | bool      | NOT NULL, DEFAULT(true)  | Push notifications    |
| EmailNotificationsEnabled        | bool      | NOT NULL, DEFAULT(false) | Email notifications   |
| InAppNotificationsEnabled        | bool      | NOT NULL, DEFAULT(true)  | In-app notifications  |
| HabitRemindersEnabled            | bool      | NOT NULL, DEFAULT(true)  | Habit reminders       |
| AchievementNotificationsEnabled  | bool      | NOT NULL, DEFAULT(true)  | Achievement alerts    |
| StreakNotificationsEnabled       | bool      | NOT NULL, DEFAULT(true)  | Streak alerts         |
| MotivationalNotificationsEnabled | bool      | NOT NULL, DEFAULT(true)  | Motivational messages |
| WeeklySummaryEnabled             | bool      | NOT NULL, DEFAULT(true)  | Weekly summaries      |
| QuietHoursStart                  | TimeSpan? | NULL                     | Quiet hours start     |
| QuietHoursEnd                    | TimeSpan? | NULL                     | Quiet hours end       |
| WeekendNotificationsEnabled      | bool      | NOT NULL, DEFAULT(true)  | Weekend notifications |
| MaxDailyNotifications            | int       | NOT NULL, DEFAULT(10)    | Daily limit           |
| ReminderSnoozeMinutes            | int       | NOT NULL, DEFAULT(15)    | Snooze duration       |
| CreatedAt                        | DateTime  | NOT NULL                 | Creation timestamp    |
| UpdatedAt                        | DateTime  | NOT NULL                 | Last update timestamp |
| UserId                           | string    | FK, NOT NULL, UNIQUE     | User reference        |

**Indexes:**

- IX_NotificationSettings_UserId (Unique, Non-clustered)

### NotificationLogs

_Notification history and queue_

| Column       | Type       | Constraints              | Description          |
| ------------ | ---------- | ------------------------ | -------------------- |
| Id           | bigint     | PK, IDENTITY             | Log identifier       |
| Title        | string     | NOT NULL                 | Notification title   |
| Message      | string     | NOT NULL                 | Notification message |
| Type         | int (enum) | NOT NULL                 | Notification type    |
| ScheduledFor | DateTime   | NOT NULL                 | Scheduled time       |
| SentAt       | DateTime?  | NULL                     | Actual sent time     |
| IsRead       | bool       | NOT NULL, DEFAULT(false) | Read status          |
| IsSent       | bool       | NOT NULL, DEFAULT(false) | Sent status          |
| CreatedAt    | DateTime   | NOT NULL                 | Creation timestamp   |
| UserId       | string     | FK, NOT NULL             | User reference       |
| HabitId      | bigint?    | FK, NULL                 | Related habit        |

**Indexes:**

- IX_NotificationLogs_UserId (Non-clustered)
- IX_NotificationLogs_HabitId (Non-clustered)
- IX_NotificationLogs_ScheduledFor (Non-clustered)

## Enums

### HabitFrequency

```
0 = Daily
1 = Weekly
2 = Monthly
3 = Yearly
```

### GoalType

```
0 = Streak
1 = TotalCompletions
2 = ConsistencyRate
3 = Duration
4 = Custom
```

### GoalTimeframe

```
0 = Daily
1 = Weekly
2 = Monthly
3 = Quarterly
4 = Yearly
5 = Custom
```

### AchievementType

```
0 = Streak
1 = TotalCompletions
2 = ConsistentWeek
3 = ConsistentMonth
4 = HabitsCreated
5 = PerfectDay
6 = EarlyBird
7 = Dedication
8 = Variety
9 = Milestone
```

### NotificationType

```
0 = HabitReminder
1 = AchievementEarned
2 = StreakMilestone
3 = MotivationalMessage
4 = WeeklySummary
5 = MissedHabit
6 = GoalReminder
```

### DayOfWeek (System Enum)

```
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

## Relationships

### One-to-Many

- User ’ Habits
- User ’ UserPreferences (1:1)
- User ’ UserStatistics (1:1)
- User ’ NotificationSettings (1:1)
- User ’ UserAchievements
- User ’ NotificationLogs
- Category ’ Habits
- Habit ’ HabitEntries
- Habit ’ HabitGoals
- Habit ’ HabitSchedules (1:1 typically)
- Habit ’ HabitStatistics (1:1)
- Habit ’ NotificationLogs
- HabitEntry ’ Reminders
- Achievement ’ UserAchievements

### Key Constraints

- Users.Id is referenced by multiple tables
- Categories can be null for habits (uncategorized)
- All timestamp fields use UTC
- Soft delete implemented via ArchivedAt for Habits
- Unique constraints ensure data integrity for statistics and preferences

## Performance Considerations

1. **Indexes**: Critical indexes are placed on foreign keys and frequently queried columns
2. **Statistics Tables**: Pre-calculated to avoid expensive aggregations
3. **Navigation Properties**: Removed in many places to prevent N+1 query issues
4. **Composite Indexes**: Used for common query patterns (e.g., HabitId + Date)
5. **Partitioning**: Consider partitioning HabitEntries and NotificationLogs by date for large datasets

## Data Integrity Rules

1. A user can have only one UserPreferences, UserStatistics, and NotificationSettings record
2. HabitEntries are unique per Habit per Date
3. UserAchievements are unique per User per Achievement
4. Habits can be soft-deleted via ArchivedAt timestamp
5. All dates/times stored in UTC
6. Cascade delete configured for user-related data
7. Categories marked as IsSystem cannot be deleted by users

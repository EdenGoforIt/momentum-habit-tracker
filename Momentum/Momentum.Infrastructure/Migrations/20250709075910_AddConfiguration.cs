using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Momentum.Infrastructure.Migrations
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Design", "CA1062:Validate arguments of public methods", Justification = "EF Core auto-generated code")]

    /// <inheritdoc />
    public partial class AddConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            Guard.Against.Null(migrationBuilder);
            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "Reminders",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "HabitSchedules",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "TimeZone",
                table: "HabitSchedules",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartDate",
                table: "HabitSchedules",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "CustomDays",
                table: "HabitSchedules",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "HabitSchedules",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "HabitGoals",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartDate",
                table: "HabitGoals",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "HabitGoals",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "HabitGoals",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Achievements",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Achievements",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Achievements",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateTable(
                name: "HabitStatistics",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TotalCompletions = table.Column<int>(type: "int", nullable: false),
                    TotalEntries = table.Column<int>(type: "int", nullable: false),
                    CompletionRate = table.Column<double>(type: "float", nullable: false),
                    CurrentStreak = table.Column<int>(type: "int", nullable: false),
                    LongestStreak = table.Column<int>(type: "int", nullable: false),
                    LastCompletionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StreakStartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletionsThisWeek = table.Column<int>(type: "int", nullable: false),
                    CompletionsThisMonth = table.Column<int>(type: "int", nullable: false),
                    CompletionsThisYear = table.Column<int>(type: "int", nullable: false),
                    WeeklyCompletionRate = table.Column<double>(type: "float", nullable: false),
                    MonthlyCompletionRate = table.Column<double>(type: "float", nullable: false),
                    MissedDays = table.Column<int>(type: "int", nullable: false),
                    ConsecutiveMissedDays = table.Column<int>(type: "int", nullable: false),
                    AverageCompletionTime = table.Column<TimeSpan>(type: "time", nullable: true),
                    BestCompletionTime = table.Column<TimeSpan>(type: "time", nullable: true),
                    MostActiveDay = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    MostActiveTimeOfDay = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    HabitId = table.Column<long>(type: "bigint", nullable: false),
                    LastCalculated = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HabitStatistics", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NotificationSettings",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GlobalNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    PushNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    EmailNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    InAppNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    HabitRemindersEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AchievementNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    StreakNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    MotivationalNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    WeeklySummaryEnabled = table.Column<bool>(type: "bit", nullable: false),
                    QuietHoursStart = table.Column<TimeSpan>(type: "time", nullable: true),
                    QuietHoursEnd = table.Column<TimeSpan>(type: "time", nullable: true),
                    WeekendNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    MaxDailyNotifications = table.Column<int>(type: "int", nullable: false),
                    ReminderSnoozeMinutes = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationSettings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotificationSettings_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserPreferences",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    PushNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    EmailNotificationsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    DarkModeEnabled = table.Column<bool>(type: "bit", nullable: false),
                    Theme = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    WeekStartsOnMonday = table.Column<bool>(type: "bit", nullable: false),
                    DateFormat = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TimeFormat = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    ShowCompletionPercentage = table.Column<bool>(type: "bit", nullable: false),
                    ShowStreaks = table.Column<bool>(type: "bit", nullable: false),
                    ReminderAdvanceMinutes = table.Column<int>(type: "int", nullable: false),
                    DataSharingEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AnalyticsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserPreferences_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserStatistics",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CurrentStreak = table.Column<int>(type: "int", nullable: false),
                    LongestStreak = table.Column<int>(type: "int", nullable: false),
                    LastStreakDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TotalHabitsCompleted = table.Column<int>(type: "int", nullable: false),
                    TotalHabitsCreated = table.Column<int>(type: "int", nullable: false),
                    OverallCompletionRate = table.Column<double>(type: "float", nullable: false),
                    CompletionsThisWeek = table.Column<int>(type: "int", nullable: false),
                    CompletionsThisMonth = table.Column<int>(type: "int", nullable: false),
                    CompletionsThisYear = table.Column<int>(type: "int", nullable: false),
                    ActiveHabits = table.Column<int>(type: "int", nullable: false),
                    ArchivedHabits = table.Column<int>(type: "int", nullable: false),
                    FirstHabitCreated = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ConsecutiveDaysActive = table.Column<int>(type: "int", nullable: false),
                    WeeklyConsistencyRate = table.Column<double>(type: "float", nullable: false),
                    MonthlyConsistencyRate = table.Column<double>(type: "float", nullable: false),
                    BadgesEarned = table.Column<int>(type: "int", nullable: false),
                    MilestonesReached = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserStatistics", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NotificationSettings_UserId",
                table: "NotificationSettings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPreferences_UserId",
                table: "UserPreferences",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            Guard.Against.Null(migrationBuilder);
            migrationBuilder.DropTable(
                name: "HabitStatistics");

            migrationBuilder.DropTable(
                name: "NotificationSettings");

            migrationBuilder.DropTable(
                name: "UserPreferences");

            migrationBuilder.DropTable(
                name: "UserStatistics");

            migrationBuilder.AlterColumn<string>(
                name: "Message",
                table: "Reminders",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "HabitSchedules",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<string>(
                name: "TimeZone",
                table: "HabitSchedules",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartDate",
                table: "HabitSchedules",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<string>(
                name: "CustomDays",
                table: "HabitSchedules",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "HabitSchedules",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "HabitGoals",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartDate",
                table: "HabitGoals",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "HabitGoals",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "HabitGoals",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Achievements",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Achievements",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Achievements",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "CURRENT_TIMESTAMP");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable 

namespace Momentum.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Categories",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Color", "CreatedAt", "Description", "IconName", "IsActive", "IsSystem", "Name", "SortOrder" },
                values: new object[,]
                {
                    { 1L, "#4CAF50", new DateTime(2025, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Habits for physical and mental well-being", "health_icon", true, true, "Health", 1 },
                    { 2L, "#2196F3", new DateTime(2025, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Habits to boost productivity", "productivity_icon", true, true, "Productivity", 2 },
                    { 3L, "#FFC107", new DateTime(2025, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Habits for personal growth and learning", "learning_icon", true, true, "Learning", 3 },
                    { 4L, "#8BC34A", new DateTime(2025, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Habits for managing money and financial growth", "finance_icon", true, true, "Finance", 4 },
                    { 5L, "#E91E63", new DateTime(2025, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Physical exercise and activity habits", "fitness_icon", true, true, "Fitness", 5 },
                    { 6L, "#9C27B0", new DateTime(2025, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Habits for meditation and mental clarity", "mindfulness_icon", true, true, "Mindfulness", 6 },
                    { 7L, "#FF9800", new DateTime(2025, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Habits to improve social connections", "relationships_icon", true, true, "Relationships", 7 },
                    { 8L, "#00BCD4", new DateTime(2025, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Habits to boost creative skills", "creativity_icon", true, true, "Creativity", 8 },
                    { 9L, "#607D8B", new DateTime(2025, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Habits for personal well-being and care", "selfcare_icon", true, true, "Self-Care", 9 },
                    { 10L, "#795548", new DateTime(2025, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "Habits for staying organized and tidy", "organization_icon", true, true, "Organization", 10 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3L);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4L);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5L);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 6L);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 7L);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 8L);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 9L);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 10L);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Categories",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }
    }
}

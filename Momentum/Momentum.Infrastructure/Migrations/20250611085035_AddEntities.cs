using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Momentum.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            Guard.Against.Null(migrationBuilder, nameof(migrationBuilder));

            migrationBuilder.DropForeignKey(
                name: "FK_Habit_AspNetUsers_UserId",
                table: "Habit");

            migrationBuilder.DropForeignKey(
                name: "FK_Habit_Category_CategoryId",
                table: "Habit");

            migrationBuilder.DropForeignKey(
                name: "FK_HabitEntry_Habit_HabitId",
                table: "HabitEntry");

            migrationBuilder.DropForeignKey(
                name: "FK_Reminder_HabitEntry_HabitEntryId",
                table: "Reminder");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reminder",
                table: "Reminder");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HabitEntry",
                table: "HabitEntry");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Habit",
                table: "Habit");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Category",
                table: "Category");

            migrationBuilder.RenameTable(
                name: "Reminder",
                newName: "Reminders");

            migrationBuilder.RenameTable(
                name: "HabitEntry",
                newName: "HabitEntries");

            migrationBuilder.RenameTable(
                name: "Habit",
                newName: "Habits");

            migrationBuilder.RenameTable(
                name: "Category",
                newName: "Categories");

            migrationBuilder.RenameIndex(
                name: "IX_Reminder_HabitEntryId",
                table: "Reminders",
                newName: "IX_Reminders_HabitEntryId");

            migrationBuilder.RenameIndex(
                name: "IX_HabitEntry_HabitId",
                table: "HabitEntries",
                newName: "IX_HabitEntries_HabitId");

            migrationBuilder.RenameIndex(
                name: "IX_Habit_UserId",
                table: "Habits",
                newName: "IX_Habits_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Habit_CategoryId",
                table: "Habits",
                newName: "IX_Habits_CategoryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reminders",
                table: "Reminders",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HabitEntries",
                table: "HabitEntries",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Habits",
                table: "Habits",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categories",
                table: "Categories",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HabitEntries_Habits_HabitId",
                table: "HabitEntries",
                column: "HabitId",
                principalTable: "Habits",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Habits_AspNetUsers_UserId",
                table: "Habits",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Habits_Categories_CategoryId",
                table: "Habits",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reminders_HabitEntries_HabitEntryId",
                table: "Reminders",
                column: "HabitEntryId",
                principalTable: "HabitEntries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            Guard.Against.Null(migrationBuilder, nameof(migrationBuilder));
            migrationBuilder.DropForeignKey(
                name: "FK_HabitEntries_Habits_HabitId",
                table: "HabitEntries");

            migrationBuilder.DropForeignKey(
                name: "FK_Habits_AspNetUsers_UserId",
                table: "Habits");

            migrationBuilder.DropForeignKey(
                name: "FK_Habits_Categories_CategoryId",
                table: "Habits");

            migrationBuilder.DropForeignKey(
                name: "FK_Reminders_HabitEntries_HabitEntryId",
                table: "Reminders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reminders",
                table: "Reminders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Habits",
                table: "Habits");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HabitEntries",
                table: "HabitEntries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Categories",
                table: "Categories");

            migrationBuilder.RenameTable(
                name: "Reminders",
                newName: "Reminder");

            migrationBuilder.RenameTable(
                name: "Habits",
                newName: "Habit");

            migrationBuilder.RenameTable(
                name: "HabitEntries",
                newName: "HabitEntry");

            migrationBuilder.RenameTable(
                name: "Categories",
                newName: "Category");

            migrationBuilder.RenameIndex(
                name: "IX_Reminders_HabitEntryId",
                table: "Reminder",
                newName: "IX_Reminder_HabitEntryId");

            migrationBuilder.RenameIndex(
                name: "IX_Habits_UserId",
                table: "Habit",
                newName: "IX_Habit_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Habits_CategoryId",
                table: "Habit",
                newName: "IX_Habit_CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_HabitEntries_HabitId",
                table: "HabitEntry",
                newName: "IX_HabitEntry_HabitId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reminder",
                table: "Reminder",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Habit",
                table: "Habit",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HabitEntry",
                table: "HabitEntry",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Category",
                table: "Category",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Habit_AspNetUsers_UserId",
                table: "Habit",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Habit_Category_CategoryId",
                table: "Habit",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HabitEntry_Habit_HabitId",
                table: "HabitEntry",
                column: "HabitId",
                principalTable: "Habit",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reminder_HabitEntry_HabitEntryId",
                table: "Reminder",
                column: "HabitEntryId",
                principalTable: "HabitEntry",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

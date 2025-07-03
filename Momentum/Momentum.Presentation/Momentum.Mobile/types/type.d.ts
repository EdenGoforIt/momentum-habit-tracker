// Enums
enum HabitFrequency {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Yearly = "Yearly",
}

// Category interface
interface Category {
  id: number;
  name: string;
  habits: HabitDto[];
}

// Reminder DTO interface
interface ReminderDto {
  id?: number;
  habitEntryId: number;
  habitEntry?: HabitEntryDto;
  reminderTime: string; // TimeSpan represented as string (e.g., "08:00:00")
  dayOfWeek?: number; // 0-6 representing Sunday-Saturday
  message: string;
}

// Habit Entry DTO interface
export interface HabitEntryDto {
  id?: number;
  date: string; // ISO 8601 date string
  completed: boolean;
  note?: string;
  habitId: number;
  habit?: HabitDto;
  reminders: ReminderDto[];
}

// Main Habit DTO interface
export interface HabitDto {
  id?: number;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  createdAt: string; // ISO 8601 datetime string
  archivedAt?: string; // ISO 8601 datetime string
  userId: string;
  user?: UserDto;
  categoryId?: number;
  category?: Category;
  habitEntries: HabitEntryDto[];
}

// types/type.ts
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>; // Make sure this is properly defined
}

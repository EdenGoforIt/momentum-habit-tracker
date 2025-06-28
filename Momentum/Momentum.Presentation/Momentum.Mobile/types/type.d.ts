// Enums
enum HabitFrequency {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Yearly = "Yearly",
}

// User DTO interface
interface UserDto {
  email: string;
  userName?: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string; // ISO 8601 date string
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

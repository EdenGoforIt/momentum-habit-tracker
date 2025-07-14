// Habit frequency enum
export enum HabitFrequency {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Custom = 3,
}

// Category interface
export interface Category {
  id: number;
  name: string;
  color?: string;
  icon?: string;
}

// Habit entry interface
export interface HabitEntry {
  id: number;
  habitId: number;
  completedAt: string;
  notes?: string;
  value?: number;
}

// Main Habit interface
export interface Habit {
  id: number;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  createdAt: string;
  archivedAt?: string | null;
  userId: string;
  user?: any | null;
  categoryId?: number | null;
  category?: Category | null;
  habitEntries: HabitEntry[];
}

// DTOs for API requests
export interface CreateHabitDto {
  id?: number;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  createdAt?: string;
  archivedAt?: string | null;
  userId: string;
  user?: any | null;
  categoryId?: number | null;
  category?: Category | null;
  habitEntries?: HabitEntry[];
}

export interface UpdateHabitDto {
  id: number;
  name?: string;
  description?: string;
  frequency?: HabitFrequency;
  categoryId?: number | null;
  archivedAt?: string | null;
}

export interface GetHabitsParams {
  userId?: string;
  date?: number;
}

// API Response types
export interface HabitsResponse {
  habits: Habit[];
  total: number;
  page: number;
  limit: number;
}

export interface HabitResponse {
  habit: Habit;
}

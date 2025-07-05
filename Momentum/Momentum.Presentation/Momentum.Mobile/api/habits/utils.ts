import { Habit, HabitEntry, HabitFrequency } from "./types";

// Utility functions for habit calculations and management

/**
 * Calculate current streak for a habit
 */
export const calculateStreak = (habitEntries: HabitEntry[]): number => {
  if (!habitEntries.length) return 0;

  // Sort entries by completion date (most recent first)
  const sortedEntries = [...habitEntries].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.completedAt);
    entryDate.setHours(0, 0, 0, 0);

    // Check if entry is from current date or previous consecutive day
    const daysDiff = Math.floor(
      (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Check if habit is completed today
 */
export const isCompletedToday = (habitEntries: HabitEntry[]): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return habitEntries.some((entry) => {
    const entryDate = new Date(entry.completedAt);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
};

/**
 * Get completion rate for a habit over a period
 */
export const getCompletionRate = (
  habitEntries: HabitEntry[],
  startDate: Date,
  endDate: Date,
  frequency: HabitFrequency = HabitFrequency.Daily
): number => {
  const entries = habitEntries.filter((entry) => {
    const entryDate = new Date(entry.completedAt);
    return entryDate >= startDate && entryDate <= endDate;
  });

  let expectedCompletions = 0;
  const daysDiff = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  switch (frequency) {
    case HabitFrequency.Daily:
      expectedCompletions = daysDiff;
      break;
    case HabitFrequency.Weekly:
      expectedCompletions = Math.ceil(daysDiff / 7);
      break;
    case HabitFrequency.Monthly:
      expectedCompletions = Math.ceil(daysDiff / 30);
      break;
    default:
      expectedCompletions = daysDiff; // Default to daily
  }

  if (expectedCompletions === 0) return 0;
  return Math.min(
    100,
    Math.round((entries.length / expectedCompletions) * 100)
  );
};

/**
 * Get next due date for a habit based on frequency
 */
export const getNextDueDate = (
  lastCompletedDate: Date | null,
  frequency: HabitFrequency
): Date => {
  const today = new Date();

  if (!lastCompletedDate) {
    return today;
  }

  const nextDate = new Date(lastCompletedDate);

  switch (frequency) {
    case HabitFrequency.Daily:
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case HabitFrequency.Weekly:
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case HabitFrequency.Monthly:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      nextDate.setDate(nextDate.getDate() + 1);
  }

  return nextDate > today ? nextDate : today;
};

/**
 * Get habit status based on completion and frequency
 */
export type HabitStatus = "completed" | "pending" | "overdue" | "upcoming";

export const getHabitStatus = (habit: Habit): HabitStatus => {
  const completedToday = isCompletedToday(habit.habitEntries);

  if (completedToday) {
    return "completed";
  }

  const lastEntry = habit.habitEntries.sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )[0];

  const nextDue = getNextDueDate(
    lastEntry ? new Date(lastEntry.completedAt) : null,
    habit.frequency
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  nextDue.setHours(0, 0, 0, 0);

  if (nextDue.getTime() < today.getTime()) {
    return "overdue";
  } else if (nextDue.getTime() === today.getTime()) {
    return "pending";
  } else {
    return "upcoming";
  }
};

/**
 * Format frequency for display
 */
export const formatFrequency = (frequency: HabitFrequency): string => {
  switch (frequency) {
    case HabitFrequency.Daily:
      return "Daily";
    case HabitFrequency.Weekly:
      return "Weekly";
    case HabitFrequency.Monthly:
      return "Monthly";
    case HabitFrequency.Custom:
      return "Custom";
    default:
      return "Daily";
  }
};

/**
 * Get habits for today based on frequency and last completion
 */
export const getTodaysHabits = (habits: Habit[]): Habit[] => {
  return habits.filter((habit) => {
    if (habit.archivedAt) return false; // Exclude archived habits

    const status = getHabitStatus(habit);
    return status === "pending" || status === "overdue";
  });
};

/**
 * Get habit statistics
 */
export interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  archivedHabits: number;
  totalCompletions: number;
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
}

export const getHabitStats = (habits: Habit[]): HabitStats => {
  const activeHabits = habits.filter((h) => !h.archivedAt);
  const archivedHabits = habits.filter((h) => h.archivedAt);

  const totalCompletions = habits.reduce(
    (sum, habit) => sum + habit.habitEntries.length,
    0
  );

  // Calculate overall streak (simplified - you might want to implement more complex logic)
  const streaks = activeHabits.map((habit) =>
    calculateStreak(habit.habitEntries)
  );
  const currentStreak = Math.max(...streaks, 0);
  const bestStreak = currentStreak; // You might want to store this separately

  // Calculate overall completion rate for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const completionRates = activeHabits.map((habit) =>
    getCompletionRate(
      habit.habitEntries,
      thirtyDaysAgo,
      new Date(),
      habit.frequency
    )
  );

  const avgCompletionRate =
    completionRates.length > 0
      ? Math.round(
          completionRates.reduce((sum, rate) => sum + rate, 0) /
            completionRates.length
        )
      : 0;

  return {
    totalHabits: habits.length,
    activeHabits: activeHabits.length,
    archivedHabits: archivedHabits.length,
    totalCompletions,
    currentStreak,
    bestStreak,
    completionRate: avgCompletionRate,
  };
};

interface Habit {
  id: number;
  title: string;
  startDate: string;
  recurring: boolean;
  recurringDays: RecurringDays;
  reminder: boolean;
  reminderTime: string | null;
  streak: number;
  totalCompletions: number;
  lastCompleted: string;
  completed: boolean;
  notes: string;
}

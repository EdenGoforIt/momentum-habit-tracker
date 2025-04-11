interface RecurringDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

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

import type { AxiosError } from "axios";
import { createMutation, createQuery } from "react-query-kit";

import { client } from "../common";
import type { HabitEntry } from "./types";

// Get Habit Entries
export const useGetHabitEntries = createQuery<
  HabitEntry[],
  { habitId: number; startDate?: string; endDate?: string },
  AxiosError
>({
  queryKey: ["habitEntries"],
  fetcher: (variables) => {
    const { habitId, startDate, endDate } = variables;
    const params = new URLSearchParams();
    
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    
    const queryString = params.toString();
    const url = queryString
      ? `api/v1/habit-entries/habit/${habitId}?${queryString}`
      : `api/v1/habit-entries/habit/${habitId}`;

    return client.get(url).then((response) => response.data);
  },
});

// Create Habit Entry
export const useCreateHabitEntry = createMutation<
  HabitEntry,
  Omit<HabitEntry, "id" | "createdAt" | "updatedAt">,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: "api/v1/habit-entries",
      method: "POST",
      data: variables,
    }).then((response) => response.data),
});

// Update Habit Entry
export const useUpdateHabitEntry = createMutation<
  void,
  { entryId: number; data: Partial<HabitEntry> },
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `api/v1/habit-entries/${variables.entryId}`,
      method: "PUT",
      data: variables.data,
    }).then((response) => response.data),
});

// Toggle Habit Completion (convenience hook)
export const useToggleHabitCompletion = createMutation<
  HabitEntry,
  { habitId: number; date: string; completed: boolean },
  AxiosError
>({
  mutationFn: async (variables) => {
    // First, try to find existing entry for this date
    const entries = await client
      .get(`api/v1/habit-entries/habit/${variables.habitId}?startDate=${variables.date}&endDate=${variables.date}`)
      .then((response) => response.data);

    if (entries.length > 0) {
      // Update existing entry
      const entry = entries[0];
      return client({
        url: `api/v1/habit-entries/${entry.id}`,
        method: "PUT",
        data: {
          ...entry,
          completed: variables.completed,
          completedAt: variables.completed ? new Date().toISOString() : null,
        },
      }).then((response) => response.data);
    } else {
      // Create new entry
      return client({
        url: "api/v1/habit-entries",
        method: "POST",
        data: {
          habitId: variables.habitId,
          date: variables.date,
          completed: variables.completed,
          completedAt: variables.completed ? new Date().toISOString() : null,
        },
      }).then((response) => response.data);
    }
  },
});
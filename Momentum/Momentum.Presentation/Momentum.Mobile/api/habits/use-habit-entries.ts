import type { AxiosError } from "axios";
import { createMutation, createQuery } from "react-query-kit";

import { client } from "../common";
import type { HabitEntry } from "./types";

// Create Habit Entry (Mark as Complete)
export interface CreateHabitEntryDto {
  habitId: number;
  completedAt?: string;
  notes?: string;
  value?: number;
}

type CreateEntryVariables = CreateHabitEntryDto;
type CreateEntryResponse = { habitEntry: HabitEntry };

export const useCreateHabitEntry = createMutation<
  CreateEntryResponse,
  CreateEntryVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: "v1/habit-entries",
      method: "POST",
      data: {
        ...variables,
        completedAt: variables.completedAt || new Date().toISOString(),
      },
    }).then((response) => response.data),
});

// Get Habit Entries
export interface GetHabitEntriesParams {
  habitId?: number;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

type GetEntriesVariables = GetHabitEntriesParams;
type GetEntriesResponse = {
  habitEntries: HabitEntry[];
  total: number;
  page: number;
  limit: number;
};

export const useGetHabitEntries = createQuery<
  GetEntriesResponse,
  GetEntriesVariables,
  AxiosError
>({
  queryKey: ["habitEntries"],
  fetcher: (variables) => {
    const params = new URLSearchParams();

    if (variables.habitId)
      params.append("habitId", variables.habitId.toString());
    if (variables.userId) params.append("userId", variables.userId);
    if (variables.startDate) params.append("startDate", variables.startDate);
    if (variables.endDate) params.append("endDate", variables.endDate);
    if (variables.page) params.append("page", variables.page.toString());
    if (variables.limit) params.append("limit", variables.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `v1/habit-entries?${queryString}`
      : "v1/habit-entries";

    return client.get(url).then((response) => response.data);
  },
});

// Delete Habit Entry (Remove Completion)
type DeleteEntryVariables = { entryId: number };
type DeleteEntryResponse = { success: boolean };

export const useDeleteHabitEntry = createMutation<
  DeleteEntryResponse,
  DeleteEntryVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `v1/habit-entries/${variables.entryId}`,
      method: "DELETE",
    }).then((response) => response.data),
});

// Update Habit Entry
export interface UpdateHabitEntryDto {
  id: number;
  notes?: string;
  value?: number;
  completedAt?: string;
}

type UpdateEntryVariables = UpdateHabitEntryDto;
type UpdateEntryResponse = { habitEntry: HabitEntry };

export const useUpdateHabitEntry = createMutation<
  UpdateEntryResponse,
  UpdateEntryVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `v1/habit-entries/${variables.id}`,
      method: "PUT",
      data: variables,
    }).then((response) => response.data),
});

// Get Today's Entries for User
export const useGetTodaysEntries = (userId: string) => {
  const today = new Date().toISOString().split("T")[0];

  return useGetHabitEntries({
    variables: {
      userId,
      startDate: `${today}T00:00:00Z`,
      endDate: `${today}T23:59:59Z`,
    },
    enabled: !!userId,
  });
};

// Get Entries for Specific Habit
export const useGetHabitEntriesForHabit = (
  habitId: number,
  options?: Partial<GetHabitEntriesParams>
) => {
  return useGetHabitEntries({
    variables: { habitId, ...options },
    enabled: !!habitId,
  });
};

// Get Habit Entries by Habit ID (Direct API call)
export const getHabitEntriesByHabitId = async (
  habitId: number,
  startDate?: string,
  endDate?: string
): Promise<HabitEntry[]> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  
  const queryString = params.toString();
  const url = queryString
    ? `api/v1/habit-entries/habit/${habitId}?${queryString}`
    : `api/v1/habit-entries/habit/${habitId}`;
  
  const response = await client.get(url);
  return response.data;
};

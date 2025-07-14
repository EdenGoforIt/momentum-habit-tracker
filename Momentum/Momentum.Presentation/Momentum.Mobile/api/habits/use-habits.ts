import type { AxiosError } from "axios";
import { createMutation, createQuery } from "react-query-kit";

import { client } from "../common";
import type {
  CreateHabitDto,
  GetHabitsParams,
  HabitResponse,
  HabitsResponse,
  UpdateHabitDto,
} from "./types";

type Variables = CreateHabitDto;
type Response = HabitResponse;

// Create Habit
export const useCreateHabit = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: "v1/habits",
      method: "POST",
      data: variables,
    }).then((response) => response.data),
});

// Update Habit
type UpdateHabitVariables = UpdateHabitDto;
type UpdateHabitResponse = HabitResponse;

export const useUpdateHabit = createMutation<
  UpdateHabitResponse,
  UpdateHabitVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `v1/habits/${variables.id}`,
      method: "PUT",
      data: variables,
    }).then((response) => response.data),
});

// Delete Habit
type DeleteHabitVariables = { habitId: number };
type DeleteHabitResponse = { success: boolean };

export const useDeleteHabit = createMutation<
  DeleteHabitResponse,
  DeleteHabitVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `v1/habits/${variables.habitId}`,
      method: "DELETE",
    }).then((response) => response.data),
});

// Archive Habit
type ArchiveHabitVariables = { habitId: number };
type ArchiveHabitResponse = HabitResponse;

export const useArchiveHabit = createMutation<
  ArchiveHabitResponse,
  ArchiveHabitVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `v1/habits/${variables.habitId}/archive`,
      method: "POST",
    }).then((response) => response.data),
});

// Restore Habit
type RestoreHabitVariables = { habitId: number };
type RestoreHabitResponse = HabitResponse;

export const useRestoreHabit = createMutation<
  RestoreHabitResponse,
  RestoreHabitVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `v1/habits/${variables.habitId}/restore`,
      method: "POST",
    }).then((response) => response.data),
});

// Get User's Habits (convenience hook)
// If you want to add extraParams to the Axios request, you need to merge them into the query parameters when calling useGetHabits.
// Modify the hook to spread extraParams into the variables:

export const useGetUserHabits = createQuery<
  HabitsResponse,
  GetHabitsParams,
  AxiosError
>({
  queryKey: ["userHabits"],
  fetcher: (variables) => {
    if (!variables.userId) throw new Error("userId is required");

    const { userId, ...rest } = variables;
    const params = new URLSearchParams();

    if (rest.date) params.append("date", rest.date.toString());

    const queryString = params.toString();
    const url = queryString
      ? `v1/habits/${userId}/habits?${queryString}`
      : `v1/habits/${userId}/habits`;

    return client.get(url).then((response) => response.data);
  },
});

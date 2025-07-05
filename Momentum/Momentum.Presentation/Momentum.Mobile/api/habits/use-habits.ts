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

// Get All Habits
type GetHabitsVariables = GetHabitsParams;
type GetHabitsResponse = HabitsResponse;

export const useGetHabits = createQuery<
  GetHabitsResponse,
  GetHabitsVariables,
  AxiosError
>({
  queryKey: ["habits"],
  fetcher: (variables) => {
    const params = new URLSearchParams();

    if (variables.userId) params.append("userId", variables.userId);
    if (variables.categoryId)
      params.append("categoryId", variables.categoryId.toString());
    if (variables.includeArchived)
      params.append("includeArchived", variables.includeArchived.toString());
    if (variables.page) params.append("page", variables.page.toString());
    if (variables.limit) params.append("limit", variables.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `v1/habits?${queryString}` : "v1/habits";

    return client.get(url).then((response) => response.data);
  },
});

// Get Single Habit
type GetHabitVariables = { habitId: number };
type GetHabitResponse = HabitResponse;

export const useGetHabit = createQuery<
  GetHabitResponse,
  GetHabitVariables,
  AxiosError
>({
  queryKey: ["habit"],
  fetcher: (variables) =>
    client
      .get(`v1/habits/${variables.habitId}`)
      .then((response) => response.data),
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
export const useGetUserHabits = (
  userId: string,
  options?: Partial<GetHabitsParams>
) => {
  return useGetHabits({
    variables: { userId, ...options },
    enabled: !!userId,
  });
};

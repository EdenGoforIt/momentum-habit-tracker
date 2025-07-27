import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";

import { client } from "../common";
import type { UserDto } from "./types";

// Update User Profile with JSON Patch operations
export interface UpdateUserDto {
  id: string;
  firstName: string;
  lastName: string;
}

interface PatchOperation {
  op: "replace" | "add" | "remove";
  path: string;
  value?: any;
}

type UpdateUserVariables = UpdateUserDto;
type UpdateUserResponse = UserDto;

export const useUpdateUser = createMutation<
  UpdateUserResponse,
  UpdateUserVariables,
  AxiosError
>({
  mutationFn: async (variables) => {
    const patchOperations: PatchOperation[] = [
      {
        op: "replace",
        path: "/firstName",
        value: variables.firstName,
      },
      {
        op: "replace",
        path: "/lastName",
        value: variables.lastName,
      },
    ];

    return client({
      url: `api/v1/users/${variables.id}`,
      method: "PATCH",
      data: patchOperations,
    }).then((response) => response.data);
  },
});

// Get User by ID
type GetUserVariables = { userId: string };
type GetUserResponse = UserDto;

export const useGetUser = createMutation<
  GetUserResponse,
  GetUserVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: `api/v1/users/${variables.userId}`,
      method: "GET",
    }).then((response) => response.data),
});
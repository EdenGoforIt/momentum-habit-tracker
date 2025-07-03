import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";

import { client } from "../common";
import type { LoginDto, LoginResponseDto } from "./types";

type Variables = LoginDto;
type Response = LoginResponseDto;

export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
  [key: string]: any;
}

export interface ApiError extends Error {
  status: number;
  data?: ProblemDetails;
  response?: {
    status: number;
    data: ProblemDetails;
  };
}

export const useLogin = createMutation<
  Response,
  Variables,
  AxiosError<ProblemDetails>
>({
  mutationFn: async (variables) =>
    client({
      url: "auth/login",
      method: "POST",
      data: variables,
    })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("erroraxois", error.response.data);
        throw error;
      }),
});

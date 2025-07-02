import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";

import { client } from "../common";
import type { LoginDto, LoginResponseDto } from "./types";

type Variables = LoginDto;
type Response = LoginResponseDto;

export const useLogin = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: "auth/login",
      method: "POST",
      data: variables,
    }).then((response) => response.data),
});

import type { AxiosError } from "axios";
import { createQuery } from "react-query-kit";

import { client } from "../common";
import type { UserDto } from "./types";

type Response = UserDto;
type Variables = { email: string };

export const useGetUser = createQuery<Response, Variables, AxiosError>({
  queryKey: ["user"],
  fetcher: (variables) => {
    return client
      .get(`users?email=${variables.email}`)
      .then((response) => response.data);
  },
});

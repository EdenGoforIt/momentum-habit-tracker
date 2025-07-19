import type { AxiosError } from "axios";
import { createQuery } from "react-query-kit";

import { client } from "../common";
import type { Category } from "./types";

// Get Categories
export const useGetCategories = createQuery<Category[], void, AxiosError>({
  queryKey: ["categories"],
  fetcher: () => {
    return client.get("api/v1/categories").then((response) => response.data);
  },
});
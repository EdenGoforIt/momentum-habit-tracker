import { UserDto } from "@/api";
import { AUTH_STORAGE_KEYS } from "@/constants/auth";
import { getItem, removeItem, setItem } from "@/lib/storage";

export type TokenType = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export const getToken = () => getItem<TokenType>(AUTH_STORAGE_KEYS.TOKEN);
export const removeToken = () => removeItem(AUTH_STORAGE_KEYS.TOKEN);
export const setToken = (value: TokenType) =>
  setItem<TokenType>(AUTH_STORAGE_KEYS.TOKEN, value);
export const setUser = (user: UserDto) =>
  setItem<UserDto>(AUTH_STORAGE_KEYS.USER, user);
export const getUser = () => getItem<UserDto>(AUTH_STORAGE_KEYS.USER);
export const getUserId = async (): Promise<string | undefined> => {
  const user = await getItem<UserDto>(AUTH_STORAGE_KEYS.USER);
  return user?.id;
};

import { UserDto } from "@/api";
import { getItem, removeItem, setItem } from "@/lib/storage";

const TOKEN = "token";
const USER = "user";

export type TokenType = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export const getToken = () => getItem<TokenType>(TOKEN);
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);
export const setUser = (user: UserDto) => setItem<UserDto>(USER, user);
export const getUser = () => getItem<UserDto>(USER);

import { create } from "zustand";

import { UserDto } from "@/api";
import { AUTH_STATUS, type AuthStatus } from "@/constants/auth";
import { createSelectors } from "../utils";
import type { TokenType } from "./utils";
import { getToken, getUser, removeToken, removeUser, setToken, setUser as setUserInStorage } from "./utils";

interface AuthState {
  token: TokenType | null;
  user: UserDto | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  signIn: (data: TokenType) => void;
  setUser: (user: UserDto) => void;
  signOut: () => void;
  hydrate: () => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: AUTH_STATUS.IDLE,
  isAuthenticated: false,
  token: null,
  user: null,
  signIn: (token) => {
    setToken(token);
    set({ status: AUTH_STATUS.SIGNED_IN, token, isAuthenticated: true });
  },
  setUser: (user) => {
    setUserInStorage(user);
    set({ user });
  },
  signOut: () => {
    removeToken();
    removeUser();
    set({ status: AUTH_STATUS.SIGNED_OUT, token: null, isAuthenticated: false, user: null });
  },
  hydrate: async () => {
    try {
      const userToken = await getToken();
      const userData = await getUser();
      
      if (userToken !== null) {
        get().signIn(userToken);
        if (userData !== null) {
          set({ user: userData });
        }
      } else {
        get().signOut();
      }
    } catch (e) {
      console.error("Hydration error:", e);
    }
  },
}));

export const useAuth = createSelectors(_useAuth);
export const useIsAuthenticated = () => {
  const token = useAuth.use.token();
  const user = useAuth.use.user();
  
  // For ASP.NET Core Data Protection tokens, check if token and user exist
  return !!(token && user);
};
export const signOut = () => _useAuth.getState().signOut();
export const signIn = (token: TokenType) => _useAuth.getState().signIn(token);
export const hydrateAuth = () => _useAuth.getState().hydrate();

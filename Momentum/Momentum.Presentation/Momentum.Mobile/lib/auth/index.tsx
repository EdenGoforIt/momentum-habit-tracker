import { create } from "zustand";

import { UserDto } from "@/api";
import { AUTH_STATUS, type AuthStatus } from "@/constants/auth";
import { createSelectors } from "../utils";
import type { TokenType } from "./utils";
import { getToken, removeToken, setToken, setUser } from "./utils";

interface AuthState {
  token: TokenType | null;
  user: UserDto | null;
  status: AuthStatus;
  signIn: (data: TokenType) => void;
  setUser: (user: UserDto) => void;
  signOut: () => void;
  hydrate: () => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: AUTH_STATUS.IDLE,
  token: null,
  user: null,
  signIn: (token) => {
    setToken(token);
    set({ status: AUTH_STATUS.SIGNED_IN, token });
  },
  setUser: (user) => {
    setUser(user);
    set({ user });
  },
  signOut: () => {
    removeToken();
    set({ status: AUTH_STATUS.SIGNED_OUT, token: null });
  },
  hydrate: async () => {
    try {
      const userToken = await getToken();
      if (userToken !== null) {
        get().signIn(userToken);
      } else {
        get().signOut();
      }
    } catch (e) {
      // only to remove eslint error, handle the error properly
      console.error(e);
      // catch error here
      // Maybe sign_out user!
    }
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (token: TokenType) => _useAuth.getState().signIn(token);
export const hydrateAuth = async () => await _useAuth.getState().hydrate();

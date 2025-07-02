import { create } from "zustand";

import { UserDto } from "@/api";
import { createSelectors } from "../utils";
import type { TokenType } from "./utils";
import { getToken, removeToken, setToken, setUser } from "./utils";

interface AuthState {
  token: TokenType | null;
  user: UserDto | null;
  status: "idle" | "signOut" | "signIn";
  signIn: (data: TokenType) => void;
  setUser: (user: UserDto) => void;
  signOut: () => void;
  hydrate: () => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: "idle",
  token: null,
  user: null,
  signIn: (token) => {
    setToken(token);
    set({ status: "signIn", token });
  },
  setUser: (user) => {
    setUser(user);
    set({ user });
  },
  signOut: () => {
    removeToken();
    set({ status: "signOut", token: null });
  },
  hydrate: () => {
    try {
      const userToken = getToken();
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
export const hydrateAuth = () => _useAuth.getState().hydrate();

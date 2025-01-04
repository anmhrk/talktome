"use client";

import { createContext, useContext } from "react";
import { type Friend } from "./friend-handler";

export interface FriendContextType {
  friend: Friend | null;
  loading: boolean;
}

export const FriendContext = createContext<FriendContextType>({
  friend: null,
  loading: true,
});

export function useFriend() {
  return useContext(FriendContext);
}

"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/api";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clear: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        // Also mirror the token to a cookie so Next.js middleware can gate /admin
        if (typeof document !== "undefined") {
          document.cookie = `flamora_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
          document.cookie = `flamora_role=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
        }
        set({ user, token });
      },
      clear: () => {
        if (typeof document !== "undefined") {
          document.cookie = "flamora_token=; path=/; max-age=0";
          document.cookie = "flamora_role=; path=/; max-age=0";
        }
        set({ user: null, token: null });
      },
    }),
    { name: "flamora-auth" },
  ),
);

export const useCart = useCartStore;
export const useWishlist = useWishlistStore;

type SearchStore = {
  isSearching: boolean;
  setIsSearching: (val: boolean) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  isSearching: false,
  setIsSearching: (isSearching) => set({ isSearching }),
}));



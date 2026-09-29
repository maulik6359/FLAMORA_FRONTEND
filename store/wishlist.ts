"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  add: (productId: string) => void;
  remove: (productId: string) => void;
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],

      add: (productId) =>
        set((state) => ({
          ids: state.ids.includes(productId)
            ? state.ids
            : [...state.ids, productId],
        })),

      remove: (productId) =>
        set((state) => ({
          ids: state.ids.filter((id) => id !== productId),
        })),

      toggle: (productId) => {
        const exists = get().ids.includes(productId);

        set((state) => ({
          ids: exists
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId],
        }));
      },

      has: (productId) => get().ids.includes(productId),

      clear: () => set({ ids: [] }),
    }),
    {
      name: "flamora-wishlist",
    },
  ),
);
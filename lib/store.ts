"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/api";

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

type CartItem = { productId: string; name: string; slug: string; image?: string; price: number; quantity: number; stock: number };

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const idx = s.items.findIndex((i) => i.productId === item.productId);
          if (idx >= 0) {
            const items = [...s.items];
            items[idx] = { ...items[idx], quantity: Math.min(items[idx].quantity + item.quantity, item.stock) };
            return { items };
          }
          return { items: [...s.items, item] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.productId !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) => (i.productId === id ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock)) } : i)),
        })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "flamora-cart" },
  ),
);

type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
  set: (ids: string[]) => void;
  has: (id: string) => boolean;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
      set: (ids) => set({ ids }),
      has: (id) => get().ids.includes(id),
    }),
    { name: "flamora-wishlist" },
  ),
);

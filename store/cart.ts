"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  metal?: string;
  size?: string;
}

interface AddCartItem {
  id?: string;
  productId?: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity?: number;
  metal?: string;
  size?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: AddCartItem) => void;
  removeItem: (id: string, metal?: string, size?: string) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    metal?: string,
    size?: string,
  ) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

function isSameItem(
  item: CartItem,
  id: string,
  metal?: string,
  size?: string,
) {
  return (
    item.id === id &&
    item.metal === metal &&
    item.size === size
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) =>
        set((state) => {
          const quantity = newItem.quantity ?? 1;
          const itemId = newItem.id ?? newItem.productId ?? newItem.slug;

          const existingItem = state.items.find((item) =>
            isSameItem(item, itemId, newItem.metal, newItem.size),
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                isSameItem(item, itemId, newItem.metal, newItem.size)
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                    }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...newItem,
                id: itemId,
                quantity,
              },
            ],
          };
        }),

      removeItem: (id, metal, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !isSameItem(item, id, metal, size),
          ),
        })),

      updateQuantity: (id, quantity, metal, size) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (item) =>
                    !isSameItem(item, id, metal, size),
                )
              : state.items.map((item) =>
                  isSameItem(item, id, metal, size)
                    ? { ...item, quantity }
                    : item,
                ),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () =>
        set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "flamora-cart",
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);
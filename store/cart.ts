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
  stock?: number;
}

export interface AddCartItem {
  id?: string;
  productId?: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity?: number;
  metal?: string;
  size?: string;
  stock?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: AddCartItem) => void;
  add: (item: AddCartItem) => void;
  removeItem: (id: string, metal?: string, size?: string) => void;
  remove: (id: string, metal?: string, size?: string) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    metal?: string,
    size?: string,
  ) => void;
  setQty: (id: string, quantity: number, metal?: string, size?: string) => void;
  clearCart: () => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  subtotal: () => number;
  count: () => number;
}

function getItemUniqueKey(item: { id?: string; productId?: string; slug?: string; name?: string; metal?: string; size?: string }): string {
  const baseId = item.id || item.productId || item.slug || item.name || "item";
  return `${baseId}-${item.metal || "default"}-${item.size || "default"}`;
}

function isSameItem(
  item: CartItem,
  id: string,
  metal?: string,
  size?: string,
): boolean {
  if (!id) return false;
  
  // Direct match by composite key
  const targetKey = getItemUniqueKey({ id, metal, size });
  const itemKey = getItemUniqueKey(item);
  if (targetKey === itemKey || id === itemKey) return true;

  // Match by id or slug if metal and size match or metal/size were not explicitly passed
  const idOrSlugMatch = item.id === id || item.slug === id;
  if (!idOrSlugMatch) return false;

  const metalMatch = metal === undefined || item.metal === metal;
  const sizeMatch = size === undefined || item.size === size;
  return metalMatch && sizeMatch;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const quantity = newItem.quantity ?? 1;
          const itemId = newItem.id ?? newItem.productId ?? newItem.slug ?? "item";

          const existingIndex = state.items.findIndex((item) =>
            isSameItem(item, itemId, newItem.metal, newItem.size),
          );

          if (existingIndex >= 0) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingIndex];
            const maxStock = newItem.stock ?? currentItem.stock;
            const newQuantity = maxStock
              ? Math.min(currentItem.quantity + quantity, maxStock)
              : currentItem.quantity + quantity;

            updatedItems[existingIndex] = {
              ...currentItem,
              quantity: newQuantity,
            };
            return { items: updatedItems };
          }

          const freshItem: CartItem = {
            id: itemId,
            slug: newItem.slug,
            name: newItem.name,
            image: newItem.image || "",
            price: Number(newItem.price) || 0,
            quantity,
            metal: newItem.metal,
            size: newItem.size,
            stock: newItem.stock,
          };

          return {
            items: [...state.items, freshItem],
          };
        });
      },

      add: (newItem) => get().addItem(newItem),

      removeItem: (id, metal, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !isSameItem(item, id, metal, size),
          ),
        })),

      remove: (id, metal, size) => get().removeItem(id, metal, size),

      updateQuantity: (id, quantity, metal, size) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (item) => !isSameItem(item, id, metal, size),
                )
              : state.items.map((item) => {
                  if (isSameItem(item, id, metal, size)) {
                    const maxStock = item.stock;
                    const finalQty = maxStock ? Math.min(quantity, maxStock) : quantity;
                    return { ...item, quantity: finalQty };
                  }
                  return item;
                }),
        })),

      setQty: (id, quantity, metal, size) =>
        get().updateQuantity(id, quantity, metal, size),

      clearCart: () => set({ items: [] }),
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
          0,
        ),

      count: () =>
        get().items.reduce(
          (sum, item) => sum + (Number(item.quantity) || 0),
          0,
        ),
    }),
    {
      name: "flamora-cart",
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);
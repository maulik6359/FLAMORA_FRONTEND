"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, type User } from "@/lib/api";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

// ── wishlist ↔ account sync ────────────────────────────────────────────────
// The wishlist store stays device-local for guests. For a signed-in customer it mirrors
// the account's wishlist (/api/wishlist): on sign-in (or reload with a saved session)
// local items are merged into the account and the account's list becomes the local one;
// afterwards every add/remove is sent to the API.
let syncingWishlist = false;

async function syncWishlist(token: string) {
  syncingWishlist = true;
  try {
    const local = useWishlistStore.getState().ids;
    await Promise.all(local.map((id) => api.addWishlist(id, token).catch(() => {})));
    const remote = await api.wishlist(token);
    useWishlistStore.getState().set(remote.items.map((p) => p._id));
  } catch {
    // offline or session ended: keep the local list
  } finally {
    syncingWishlist = false;
  }
}

useWishlistStore.subscribe((state, prev) => {
  const token = useAuth.getState().token;
  if (syncingWishlist || !token) return;
  for (const id of state.ids) if (!prev.ids.includes(id)) api.addWishlist(id, token).catch(() => {});
  for (const id of prev.ids) if (!state.ids.includes(id)) api.removeWishlist(id, token).catch(() => {});
});

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  /** Forgets the session on this device only (e.g. after the server rejected the token). */
  clear: () => void;
  /** Signs out: ends the session on the server too, then forgets it locally. */
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        // Also mirror the token to a cookie so Next.js middleware can gate /admin
        if (typeof document !== "undefined") {
          document.cookie = `flamora_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
          document.cookie = `flamora_role=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
        }
        set({ user, token });
        syncWishlist(token);
      },
      clear: () => {
        if (typeof document !== "undefined") {
          document.cookie = "flamora_token=; path=/; max-age=0";
          document.cookie = "flamora_role=; path=/; max-age=0";
        }
        set({ user: null, token: null });
      },
      logout: async () => {
        const { token } = get();
        // Sign out locally even if the server can't be reached.
        if (token) await api.logout(token).catch(() => {});
        get().clear();
        // Signing out leaves nothing personal on a shared device: the bag and the
        // wishlist go too (the wishlist is kept on the account).
        useCartStore.getState().clear();
        useWishlistStore.getState().clear();
      },
    }),
    {
      name: "flamora-auth",
      onRehydrateStorage: () => (state) => {
        if (state?.token) syncWishlist(state.token);
      },
    },
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



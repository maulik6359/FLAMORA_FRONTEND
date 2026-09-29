import apiClient from './axios'
import type { ApiWishlist } from '@/lib/types'

// ─── Wishlist API ─────────────────────────────────────────────────────────────

export async function getWishlist(): Promise<ApiWishlist | null> {
  try {
    const res = await apiClient.get<{ status: string; data: { wishlist: ApiWishlist } }>(
      '/wishlist'
    )
    return res.data.data?.wishlist || null
  } catch {
    return null
  }
}

export async function addToWishlist(productId: string): Promise<ApiWishlist> {
  const res = await apiClient.post<{ status: string; data: { wishlist: ApiWishlist } }>(
    '/wishlist',
    { productId }
  )
  return res.data.data.wishlist
}

export async function removeFromWishlist(productId: string): Promise<ApiWishlist> {
  const res = await apiClient.delete<{ status: string; data: { wishlist: ApiWishlist } }>(
    `/wishlist/${productId}`
  )
  return res.data.data.wishlist
}

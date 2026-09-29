import apiClient from './axios'
import type { ApiCart } from '@/lib/types'

// ─── Cart API ─────────────────────────────────────────────────────────────────

export async function getCart(): Promise<ApiCart | null> {
  try {
    const res = await apiClient.get<{ status: string; data: { cart: ApiCart } }>('/cart')
    return res.data.data?.cart || null
  } catch {
    return null
  }
}

export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<ApiCart> {
  const res = await apiClient.post<{ status: string; data: { cart: ApiCart } }>('/cart', {
    productId,
    quantity,
  })
  return res.data.data.cart
}

export async function updateCartItem(
  productId: string,
  quantity: number
): Promise<ApiCart> {
  const res = await apiClient.patch<{ status: string; data: { cart: ApiCart } }>(
    `/cart/items/${productId}`,
    { quantity }
  )
  return res.data.data.cart
}

export async function removeFromCart(productId: string): Promise<ApiCart> {
  const res = await apiClient.delete<{ status: string; data: { cart: ApiCart } }>(
    `/cart/items/${productId}`
  )
  return res.data.data.cart
}

export async function clearCart(): Promise<void> {
  await apiClient.delete('/cart')
}

export async function applyCoupon(code: string): Promise<ApiCart> {
  const res = await apiClient.post<{ status: string; data: { cart: ApiCart } }>(
    '/cart/apply-coupon',
    { code }
  )
  return res.data.data.cart
}

export async function removeCoupon(): Promise<ApiCart> {
  const res = await apiClient.post<{ status: string; data: { cart: ApiCart } }>(
    '/cart/remove-coupon'
  )
  return res.data.data.cart
}

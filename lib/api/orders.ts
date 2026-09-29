import apiClient from './axios'
import type { ApiOrder, ShippingAddress } from '@/lib/types'

// ─── Orders API ───────────────────────────────────────────────────────────────

export interface CreateOrderData {
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  paymentMethod: 'Card' | 'PayPal' | 'COD'
}

export async function createOrder(data: CreateOrderData): Promise<ApiOrder> {
  const res = await apiClient.post<{ status: string; data: { order: ApiOrder } }>('/orders', data)
  return res.data.data.order
}

export async function getMyOrders(): Promise<ApiOrder[]> {
  try {
    const res = await apiClient.get<{ status: string; data: { orders: ApiOrder[] } }>(
      '/orders/my-orders'
    )
    return res.data.data?.orders || []
  } catch {
    return []
  }
}

export async function getOrder(id: string): Promise<ApiOrder | null> {
  try {
    const res = await apiClient.get<{ status: string; data: { order: ApiOrder } }>(
      `/orders/${id}`
    )
    return res.data.data?.order || null
  } catch {
    return null
  }
}

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Loader2, Package } from 'lucide-react'

import { api, formatPrice, type Order } from '@/lib/api'
import { useAuth } from '@/lib/store'
import { useHydrated } from '@/hooks/use-hydrated'

const statusColors: Record<string, string> = {
  pending: 'text-amber-700 bg-amber-50',
  confirmed: 'text-emerald-700 bg-emerald-50',
  processing: 'text-amber-600 bg-amber-50',
  shipped: 'text-blue-600 bg-blue-50',
  delivered: 'text-green-600 bg-green-50',
  cancelled: 'text-red-600 bg-red-50',
}

export default function OrdersPage() {
  const hydrated = useHydrated()
  const token = useAuth((s) => s.token)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!hydrated) return
    if (!token) {
      setLoading(false)
      return
    }
    api
      .myOrders(token)
      .then((r) => setOrders(r.orders))
      .catch((err) => setError(err.message || 'Could not load your orders'))
      .finally(() => setLoading(false))
  }, [hydrated, token])

  if (!hydrated || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" aria-live="polite">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading orders" />
      </div>
    )
  }

  if (!token) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
        <Package className="size-12 text-muted-foreground" strokeWidth={1} />
        <h1 className="mt-6 font-heading text-3xl">My Orders</h1>
        <p className="mt-4 text-sm text-muted-foreground">Sign in to view your order history.</p>
        <Link
          href="/auth/login?from=/orders"
          className="mt-8 bg-primary px-6 py-3 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Sign In
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="font-heading text-3xl">My Orders</h1>
        <p className="mt-4 text-sm text-muted-foreground">We couldn&apos;t load your orders just now. Please try again in a moment.</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
        <Package className="size-12 text-muted-foreground" strokeWidth={1} />
        <h1 className="mt-6 font-heading text-3xl">My Orders</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          You haven&apos;t placed any orders yet.
        </p>
        <Link
          href="/shop"
          className="mt-8 bg-primary px-6 py-3 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Explore the Collection
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Account</p>
        <h1 className="mt-3 font-heading text-4xl">My Orders</h1>
      </header>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order._id} className="border border-border bg-background p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Order {order.orderNumber}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('en-AU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 text-xs uppercase tracking-[0.08em] ${
                    statusColors[order.status] || 'text-foreground bg-secondary'
                  }`}
                >
                  {order.status}
                </span>
                <span className="font-heading text-lg">{formatPrice(order.total, order.currency)}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {order.items.slice(0, 3).map((item, i) => (
                <div key={i} className="text-sm text-muted-foreground">
                  {item.name}
                  {item.quantity > 1 && ` ×${item.quantity}`}
                  {i < Math.min(order.items.length, 3) - 1 && ','}
                </div>
              ))}
              {order.items.length > 3 && (
                <span className="text-sm text-muted-foreground">+{order.items.length - 3} more</span>
              )}
            </div>

            {order.trackingNumber && (
              <p className="mt-3 text-xs text-muted-foreground">
                Tracking:{' '}
                <span className="font-medium">{order.trackingNumber}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

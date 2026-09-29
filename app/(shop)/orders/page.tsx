'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Loader2, Package, ChevronRight } from 'lucide-react'
// import { useShop } from '@/components/shop/shop-provider'
import { getMyOrders } from '@/lib/api/orders'
import { formatPrice } from '@/lib/products'
import type { ApiOrder } from '@/lib/types'

export default function OrdersPage() {
  // const { isLoggedIn, isAuthLoading } = useShop()
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     setLoading(false)
  //     return
  //   }
  //   getMyOrders()
  //     .then(setOrders)
  //     .catch(() => {})
  //     .finally(() => setLoading(false))
  // }, [isLoggedIn])

  // if (isAuthLoading || loading) {
  //   return (
  //     <div className="flex min-h-[50vh] items-center justify-center">
  //       <Loader2 className="size-6 animate-spin text-muted-foreground" />
  //     </div>
  //   )
  // }

  // if (!isLoggedIn) {
  //   return (
  //     <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
  //       <Package className="size-12 text-muted-foreground" strokeWidth={1} />
  //       <h1 className="mt-6 font-heading text-3xl">My Orders</h1>
  //       <p className="mt-4 text-sm text-muted-foreground">
  //         Sign in to view your order history.
  //       </p>
  //       <Link
  //         href="/auth/login"
  //         className="mt-8 bg-primary px-6 py-3 text-sm text-primary-foreground hover:bg-primary/90"
  //       >
  //         Sign In
  //       </Link>
  //     </div>
  //   )
  // }

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

  const statusColors: Record<string, string> = {
    Processing: 'text-amber-600 bg-amber-50',
    Shipped: 'text-blue-600 bg-blue-50',
    Delivered: 'text-green-600 bg-green-50',
    Cancelled: 'text-red-600 bg-red-50',
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">Account</p>
        <h1 className="mt-3 font-heading text-4xl">My Orders</h1>
      </header>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-border bg-background p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-1 text-xs uppercase tracking-[0.08em] ${
                    statusColors[order.orderStatus] || 'text-foreground bg-secondary'
                  }`}
                >
                  {order.orderStatus}
                </span>
                <span className="font-heading text-lg">
                  {formatPrice(order.totalAmount)}
                </span>
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
                <span className="text-sm text-muted-foreground">
                  +{order.items.length - 3} more
                </span>
              )}
            </div>

            {order.trackingNumber && (
              <p className="mt-3 text-xs text-muted-foreground">
                Tracking: <span className="font-medium">{order.trackingNumber}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

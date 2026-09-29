export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  currency: string;
  category: { _id: string; name: string; slug: string } | string;
  material?: string;
  gemstone?: string;
  carat?: number;
  images: string[];
  stockQuantity: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isTrending: boolean;
};

export type Category = { _id: string; name: string; slug: string; description?: string; image?: string };

export type OrderItem = { product: string; name: string; image?: string; price: number; quantity: number };

export type Order = {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  currency: string;
  status: string;
  paymentStatus: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  shippingAddress?: any;
  createdAt: string;
};

export type User = { id: string; name: string; email: string; role: "customer" | "admin"; phone?: string };

export type PaymentMethod = {
  _id: string;
  name: string;
  type: string;
  provider: string;
  description?: string;
  isActive: boolean;
  sortOrder?: number;
};

export type RazorpayOrderResponse = {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  orderId: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
};

export type RazorpayVerifyPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId?: string;
};

export type RazorpayVerifyResponse = {
  success: boolean;
  orderId: string;
  orderNumber: string;
  paymentId: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request<T = any>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(init.headers as any) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...init, headers, credentials: "same-origin", cache: "no-store" });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
  return json as T;
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: (token: string) => request<{ user: User }>("/auth/me", {}, token),

  // Products
  products: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params as any).toString();
    return request<{ items: Product[]; total: number; page: number; limit: number }>(`/products?${qs}`);
  },
  product: (slug: string) => request<{ product: Product }>(`/products/${slug}`),
  categories: () => request<{ categories: Category[] }>("/categories"),
  paymentMethods: () => request<{ items: PaymentMethod[] }>("/payment-methods"),

  // Wishlist
  wishlist: (token: string) => request<{ items: Product[] }>("/wishlist", {}, token),
  addWishlist: (id: string, token: string) => request(`/wishlist/${id}`, { method: "POST" }, token),
  removeWishlist: (id: string, token: string) => request(`/wishlist/${id}`, { method: "DELETE" }, token),

  // Orders
  createOrder: (data: { items: { productId: string; quantity: number }[]; shippingAddress?: any }, token: string) =>
    request<{ order: Order }>("/orders", { method: "POST", body: JSON.stringify(data) }, token),
  myOrders: (token: string) => request<{ orders: Order[] }>("/orders/mine", {}, token),
  getOrder: (id: string, token: string) => request<{ order: Order }>(`/orders/${id}`, {}, token),

  // Payments (Razorpay)
  createRazorpayOrder: (orderId: string, token: string) =>
    request<RazorpayOrderResponse>("/payments/create-order", { method: "POST", body: JSON.stringify({ orderId }) }, token),
  verifyRazorpayPayment: (data: RazorpayVerifyPayload, token: string) =>
    request<RazorpayVerifyResponse>("/payments/verify", { method: "POST", body: JSON.stringify(data) }, token),
  reportPaymentFailure: (data: { orderId?: string; razorpayOrderId?: string; error?: any }, token: string) =>
    request<{ ok: boolean }>("/payments/failure", { method: "POST", body: JSON.stringify(data) }, token),
  paymentStatus: (orderId: string, token: string) =>
    request<{ paymentStatus: string; status: string; orderId: string; total: number; currency: string }>(`/payments/order/${orderId}`, {}, token),

  // Admin
  admin: {
    dashboard: (token: string) => request<any>("/admin/dashboard/stats", {}, token),
    recentOrders: (token: string) => request<{ orders: Order[] }>("/admin/dashboard/recent-orders", {}, token),
    products: (params: Record<string, any>, token: string) => {
      const qs = new URLSearchParams(params as any).toString();
      return request<{ items: Product[]; total: number }>(`/admin/products?${qs}`, {}, token);
    },
    product: (id: string, token: string) => request<{ product: Product }>(`/admin/products/${id}`, {}, token),
    createProduct: (data: any, token: string) =>
      request<{ product: Product }>("/admin/products", { method: "POST", body: JSON.stringify(data) }, token),
    updateProduct: (id: string, data: any, token: string) =>
      request<{ product: Product }>(`/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }, token),
    deleteProduct: (id: string, token: string) => request(`/admin/products/${id}`, { method: "DELETE" }, token),
    createCategory: (data: any, token: string) =>
      request<{ category: Category }>("/admin/categories", { method: "POST", body: JSON.stringify(data) }, token),
    orders: (params: Record<string, any>, token: string) => {
      const qs = new URLSearchParams(params as any).toString();
      return request<{ items: (Order & { user: any })[]; total: number }>(`/admin/orders?${qs}`, {}, token);
    },
    updateOrderStatus: (id: string, data: any, token: string) =>
      request<{ order: Order }>(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify(data) }, token),
  },
};

export function formatPrice(amount: number, currency = "EUR") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

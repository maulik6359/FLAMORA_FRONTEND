export interface ApiImage {
  public_id: string
  url: string
}

export interface ApiCategory {
  _id: string
  name: string
  slug?: string
  description?: string
  image?: ApiImage
  parentCategory?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface DiamondDetails {
  clarity?: string
  color?: string
  cut?: string
  carat?: number
  shape?: string
  quantity?: number
}

export interface GemstoneDetails {
  type?: string
  carat?: number
  shape?: string
  quantity?: number
}

export interface Dimensions {
  length?: number
  width?: number
  height?: number
  unit?: string
}

export interface ApiProduct {
  _id: string
  name: string
  slug: string
  sku?: string
  category: ApiCategory | string
  collectionName?: string
  description: string
  material: string
  purity?: string
  diamondDetails?: DiamondDetails
  gemstoneDetails?: GemstoneDetails
  weight?: number
  dimensions?: Dimensions
  price: number
  discountPrice?: number
  makingCharges?: number
  gst?: number
  stockQuantity: number
  images: ApiImage[]
  thumbnail?: ApiImage
  tags?: string[]
  ratingsAverage?: number
  ratingsQuantity?: number
  featured?: boolean
  bestSeller?: boolean
  newArrival?: boolean
  trending?: boolean
  availabilityStatus?: 'In Stock' | 'Out of Stock' | 'Made to Order'
  isActive?: boolean
  seoTitle?: string
  seoDescription?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiReview {
  _id: string
  product: string
  user: {
    _id: string
    name: string
  }
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: ApiProduct
  quantity: number
  price: number
}

export interface ApiCart {
  _id: string
  user: string
  items: CartItem[]
  coupon?: {
    code: string
    discountAmount: number
    discountType: 'percentage' | 'fixed'
    discountValue: number
  }
  subtotal: number
  discountAmount: number
  totalAmount: number
  createdAt?: string
  updatedAt?: string
}

export interface ApiWishlistItem {
  _id: string
  product: ApiProduct
  addedAt?: string
}

export interface ApiWishlist {
  _id: string
  user: string
  products: ApiProduct[]
}

export interface ShippingAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderItem {
  product: string | ApiProduct
  name: string
  price: number
  quantity: number
  image?: string
}

export interface ApiOrder {
  _id: string
  user: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  paymentMethod: 'Card' | 'PayPal' | 'COD'
  paymentStatus: 'Pending' | 'Paid' | 'Failed'
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  subtotal: number
  discountAmount?: number
  shippingCost?: number
  totalAmount: number
  trackingNumber?: string
  coupon?: string
  createdAt: string
  updatedAt: string
}

export interface ApiUser {
  _id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  phoneNumber?: string
  addresses?: ShippingAddress[]
  isVerified?: boolean
  createdAt?: string
}

export interface ApiResponse<T> {
  status: 'success' | 'error' | 'fail'
  message?: string
  data: T
  results?: number
  pagination?: {
    page: number
    limit: number
    totalPages: number
    totalResults: number
  }
}

export interface AuthResponse {
  user: ApiUser
  token: string
}

export interface GuestCartItem {
  id: string
  qty: number
}

export interface ProductQueryParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  category?: string
  material?: string
  featured?: boolean
  bestSeller?: boolean
  newArrival?: boolean
  trending?: boolean
  collectionName?: string
  purity?: string
}

import apiClient from './axios'
import type { ApiResponse, ApiProduct, ApiCategory, ApiReview, ProductQueryParams } from '@/lib/types'

// ─── Products API ─────────────────────────────────────────────────────────────

export interface ProductsResponse {
  products: ApiProduct[]
  results: number
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalResults: number
  }
}

export async function getProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
  // Map frontend sort keys to backend sort params
  const sortMap: Record<string, string> = {
    featured: '-featured,-bestSeller',
    'price-asc': 'price',
    'price-desc': '-price',
    newest: '-createdAt',
    bestSeller: '-bestSeller',
    newArrival: '-newArrival',
  }

  const queryParams: Record<string, string | number | boolean> = {}

  if (params.page) queryParams.page = params.page
  if (params.limit) queryParams.limit = params.limit
  if (params.search) queryParams.search = params.search
  if (params.sort) queryParams.sort = sortMap[params.sort] || params.sort
  if (params.material) queryParams.material = params.material
  if (params.collectionName) queryParams.collectionName = params.collectionName
  if (params.purity) queryParams.purity = params.purity
  if (params.featured !== undefined) queryParams.featured = params.featured
  if (params.bestSeller !== undefined) queryParams.bestSeller = params.bestSeller
  if (params.newArrival !== undefined) queryParams.newArrival = params.newArrival
  if (params.trending !== undefined) queryParams.trending = params.trending

  const res = await apiClient.get<{
    status: string
    results: number
    data: { products: ApiProduct[] }
    pagination?: ProductsResponse['pagination']
  }>('/products', { params: queryParams })

  return {
    products: res.data.data?.products || [],
    results: res.data.results || 0,
    pagination: res.data.pagination || {
      page: 1,
      limit: params.limit || 20,
      totalPages: 1,
      totalResults: res.data.results || 0,
    },
  }
}

export async function getProductsByCategory(
  categoryId: string,
  params: Omit<ProductQueryParams, 'category'> = {}
): Promise<ProductsResponse> {
  return getProducts({ ...params, category: categoryId })
}

export async function getProductBySlug(slug: string): Promise<ApiProduct | null> {
  try {
    const res = await apiClient.get<{ status: string; data: { product: ApiProduct } }>(
      `/products/slug/${slug}`
    )
    return res.data.data?.product || null
  } catch {
    return null
  }
}

export async function getProductById(id: string): Promise<ApiProduct | null> {
  try {
    const res = await apiClient.get<{ status: string; data: { product: ApiProduct } }>(
      `/products/${id}`
    )
    return res.data.data?.product || null
  } catch {
    return null
  }
}

// ─── Categories API ───────────────────────────────────────────────────────────

export async function getCategories(): Promise<ApiCategory[]> {
  try {
    const res = await apiClient.get<{ status: string; data: { categories: ApiCategory[] } }>(
      '/categories'
    )
    return res.data.data?.categories || []
  } catch {
    return []
  }
}

// ─── Reviews API ──────────────────────────────────────────────────────────────

export async function getProductReviews(productId: string): Promise<ApiReview[]> {
  try {
    const res = await apiClient.get<{ status: string; data: { reviews: ApiReview[] } }>(
      `/products/${productId}/reviews`
    )
    return res.data.data?.reviews || []
  } catch {
    return []
  }
}

export async function createReview(
  productId: string,
  data: { rating: number; comment: string }
): Promise<ApiReview> {
  const res = await apiClient.post<{ status: string; data: { review: ApiReview } }>(
    `/products/${productId}/reviews`,
    data
  )
  return res.data.data.review
}

export async function updateReview(
  reviewId: string,
  data: { rating?: number; comment?: string }
): Promise<ApiReview> {
  const res = await apiClient.patch<{ status: string; data: { review: ApiReview } }>(
    `/reviews/${reviewId}`,
    data
  )
  return res.data.data.review
}

export async function deleteReview(reviewId: string): Promise<void> {
  await apiClient.delete(`/reviews/${reviewId}`)
}

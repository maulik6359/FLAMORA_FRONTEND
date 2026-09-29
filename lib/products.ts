import type { ApiProduct, ApiCategory } from './types'

// ─── Legacy types kept for backward-compat with existing components ────────────
export type Category = string

export type Product = {
  id: string
  slug: string
  name: string
  category: string        // category name (for display)
  categoryId?: string     // category _id
  price: number
  discountPrice?: number
  metal: string           // maps to material
  stone: string           // maps to gemstone/diamond details or purity
  image: string           // first image URL or placeholder
  images: { url: string; public_id: string }[]
  description: string
  details: string[]
  bestseller?: boolean    // maps to bestSeller
  isNew?: boolean         // maps to newArrival
  trending?: boolean
  featured?: boolean
  stockQuantity?: number
  availabilityStatus?: string
  ratingsAverage?: number
  ratingsQuantity?: number
  tags?: string[]
  sku?: string
  _id?: string            // original MongoDB _id
}

// ─── Static category list (fallback UI labels + hrefs) ────────────────────────
// These stay static because the display labels/blurbs are UI concerns.
// The actual categories are fetched from the API.
export const staticCategories: { id: string; label: string; blurb: string }[] = [
  { id: 'rings', label: 'Rings', blurb: 'Solitaires, bands & statement pieces' },
  { id: 'necklaces', label: 'Necklaces', blurb: 'Pendants, strands & chains' },
  { id: 'earrings', label: 'Earrings', blurb: 'Studs, hoops & drops' },
  { id: 'bracelets', label: 'Bracelets', blurb: 'Tennis, chains & cuffs' },
]

// ─── Map API category to UI category ─────────────────────────────────────────
export function mapApiCategory(apiCat: ApiCategory): {
  id: string
  label: string
  blurb: string
  image?: string
} {
  return {
    id: apiCat._id,
    label: apiCat.name,
    blurb: apiCat.description || '',
    image: apiCat.image?.url,
  }
}

// ─── Map ApiProduct → Product ─────────────────────────────────────────────────
export function mapApiProduct(p: ApiProduct): Product {
  const categoryName =
    typeof p.category === 'object' && p.category !== null
      ? (p.category as ApiCategory).name
      : ''
  const categoryId =
    typeof p.category === 'object' && p.category !== null
      ? (p.category as ApiCategory)._id
      : typeof p.category === 'string'
      ? p.category
      : ''

  // Determine "stone" label from diamond/gemstone details
  let stone = p.purity || ''
  if (p.diamondDetails?.carat) {
    stone = `${p.diamondDetails.carat}ct Diamond`
    if (p.diamondDetails.shape) stone = `${p.diamondDetails.shape} ${stone}`
  } else if (p.gemstoneDetails?.type) {
    stone = `${p.gemstoneDetails.type}`
    if (p.gemstoneDetails.carat) stone += ` ${p.gemstoneDetails.carat}ct`
  }

  // Build details array from structured data
  const details: string[] = []
  if (p.diamondDetails?.carat) {
    details.push(`${p.diamondDetails.carat}ct ${p.diamondDetails.shape || ''} Diamond`)
  }
  if (p.gemstoneDetails?.type) {
    details.push(`${p.gemstoneDetails.type} ${p.gemstoneDetails.carat || ''}ct`)
  }
  if (p.material && p.purity) {
    details.push(`${p.purity} ${p.material}`)
  } else if (p.material) {
    details.push(p.material)
  }
  if (p.stockQuantity !== undefined) {
    details.push(
      p.stockQuantity > 0 ? `In Stock (${p.stockQuantity} available)` : 'Out of Stock'
    )
  }

  const firstImage =
    p.images && p.images.length > 0 ? p.images[0].url : p.thumbnail?.url || '/placeholder.svg'

  return {
    id: p._id,
    _id: p._id,
    slug: p.slug,
    name: p.name,
    category: categoryName,
    categoryId,
    price: p.price,
    discountPrice: p.discountPrice,
    metal: p.material || '',
    stone: stone || '—',
    image: firstImage,
    images: p.images || [],
    description: p.description,
    details,
    bestseller: p.bestSeller,
    isNew: p.newArrival,
    trending: p.trending,
    featured: p.featured,
    stockQuantity: p.stockQuantity,
    availabilityStatus: p.availabilityStatus,
    ratingsAverage: p.ratingsAverage,
    ratingsQuantity: p.ratingsQuantity,
    tags: p.tags,
    sku: p.sku,
  }
}

// ─── Format price ──────────────────────────────────────────────────────────────
export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

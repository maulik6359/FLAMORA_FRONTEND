export type ProductCategory =
  | "rings"
  | "necklaces"
  | "earrings"
  | "bracelets";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  collection: string;
  description: string;
  price: number;
  images: string[];
  metals: string[];
  sizes: string[];
  stock: number;
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  verified: boolean;
}

/*
|--------------------------------------------------------------------------
| Collections
|--------------------------------------------------------------------------
*/

export const collections: Collection[] = [
  {
    slug: "signature",
    name: "The Signature Collection",
    tagline: "Icons of FLĀMORÁ",
    description:
      "Timeless silhouettes, exceptional stones and refined craftsmanship created to become part of your personal story.",
    image: "/images/products/collections/signature.jpg",
  },
  {
    slug: "verdant",
    name: "Verdant",
    tagline: "Inspired by nature",
    description:
      "Rich emerald tones and organic forms inspired by gardens, leaves and the quiet beauty of the natural world.",
    image: "/images/products/collections/verdant.jpg",
  },
  {
    slug: "soiree",
    name: "Soirée",
    tagline: "Made for evenings",
    description:
      "Statement jewellery designed to illuminate celebrations, intimate dinners and unforgettable evenings.",
    image: "/images/products/collections/soiree.jpg",
  },
  {
    slug: "everyday",
    name: "Everyday Icons",
    tagline: "Quiet luxury",
    description:
      "Elegant and versatile pieces made for effortless layering and everyday wear.",
    image: "/images/products/collections/everyday.jpg",
  },
  {
    slug: "atelier",
    name: "Atelier",
    tagline: "Exceptional craftsmanship",
    description:
      "Limited creations showcasing meticulous stone setting, sculptural forms and the artistry of FLĀMORÁ.",
    image: "/images/products/collections/atelier.jpg",
  },
];

/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
|
| The product catalogue lives in the database and is served by GET /api/products
| (see lib/catalog.ts and hooks/use-catalog.ts). It was seeded from the list that
| used to be here: backend/src/seeders/data/storefrontProducts.js.
*/

/*
|--------------------------------------------------------------------------
| Testimonials
|--------------------------------------------------------------------------
*/

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-001",
    name: "Amelia R.",
    location: "Melbourne",
    quote:
      "The craftsmanship is extraordinary. My ring feels completely personal and timeless.",
    rating: 5,
    verified: true,
  },
  {
    id: "testimonial-002",
    name: "Sophia M.",
    location: "Sydney",
    quote:
      "From the packaging to the final piece, every detail felt considered and beautifully luxurious.",
    rating: 5,
    verified: true,
  },
  {
    id: "testimonial-003",
    name: "Olivia K.",
    location: "Brisbane",
    quote:
      "The emerald is even more beautiful in person. It is a piece I will treasure forever.",
    rating: 5,
    verified: true,
  },
  {
    id: "testimonial-004",
    name: "Charlotte L.",
    location: "Perth",
    quote:
      "Elegant, understated and beautifully made. The entire experience felt genuinely special.",
    rating: 5,
    verified: true,
  },
];

/*
|--------------------------------------------------------------------------
| Filter constants
|--------------------------------------------------------------------------
*/

export const ALL_METALS = [
  "18K Yellow Gold",
  "18K White Gold",
  "18K Rose Gold",
  "Platinum",
] as const;

export const ALL_GEMSTONES = [
  "Diamond",
  "Emerald",
  "Sapphire",
  "Pearl",
  "None",
] as const;

export const CATEGORIES = [
  {
    slug: "rings",
    label: "Rings",
  },
  {
    slug: "necklaces",
    label: "Necklaces",
  },
  {
    slug: "earrings",
    label: "Earrings",
  },
  {
    slug: "bracelets",
    label: "Bracelets",
  },
] as const;

/*
|--------------------------------------------------------------------------
| Collection helpers
|--------------------------------------------------------------------------
*/

export function getCollectionBySlug(
  slug: string,
): Collection | undefined {
  return collections.find(
    (collection) => collection.slug === slug,
  );
}

/*
|--------------------------------------------------------------------------
| Price formatter
|--------------------------------------------------------------------------
*/

export function formatPrice(
  price: number,
): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
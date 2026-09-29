export type Category = "rings" | "necklaces" | "earrings" | "bracelets";

export type Metal =
  | "18k Yellow Gold"
  | "18k White Gold"
  | "18k Rose Gold"
  | "Platinum";

export type Gemstone = "Diamond" | "Emerald" | "Sapphire" | "Pearl" | "None";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  collection: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  metal: Metal;
  metalOptions: Metal[];
  gemstone: Gemstone;
  sizes: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  materials: string;
  dimensions: string;
}

export interface CartLine {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  metal: Metal;
  size: string;
  quantity: number;
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
  rating: number;
  quote: string;
  verified: boolean;
}
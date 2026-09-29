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
*/

export const products: Product[] = [
  {
    id: "product-001",
    slug: "celeste-diamond-ring",
    name: "Celeste Diamond Ring",
    category: "rings",
    collection: "signature",
    description:
      "An elegant diamond ring with a refined silhouette and luminous finish.",
    price: 2890,
    images: [
      "/images/products/cat-rings.jpg",
      "/images/products/p-ring-2.jpg",
    ],
    metals: [
      "18K Yellow Gold",
      "18K White Gold",
      "Platinum",
    ],
    sizes: ["5", "6", "7", "8", "9"],
    stock: 8,
    featured: true,
    bestseller: true,
    isNew: true,
  },
  {
    id: "product-002",
    slug: "verdant-emerald-ring",
    name: "Verdant Emerald Ring",
    category: "rings",
    collection: "verdant",
    description:
      "A vivid Colombian emerald framed by delicate diamonds and polished gold.",
    price: 3650,
    images: [
      "/images/products/p-ring-2.jpg",
      "/images/products/p-ring-3.jpg",
    ],
    metals: [
      "18K Yellow Gold",
      "18K White Gold",
    ],
    sizes: ["5", "6", "7", "8"],
    stock: 5,
    featured: true,
    bestseller: true,
  },
  {
    id: "product-003",
    slug: "lumiere-diamond-necklace",
    name: "Lumière Diamond Necklace",
    category: "necklaces",
    collection: "signature",
    description:
      "A delicate diamond necklace designed to catch light with every movement.",
    price: 2490,
    images: [
      "/images/products/cat-necklaces.jpg",
      "/images/products/p-necklace-2.jpg",
    ],
    metals: [
      "18K Yellow Gold",
      "18K White Gold",
    ],
    sizes: ["40 cm", "45 cm", "50 cm"],
    stock: 10,
    featured: true,
    bestseller: true,
  },
  {
    id: "product-004",
    slug: "soiree-drop-earrings",
    name: "Soirée Drop Earrings",
    category: "earrings",
    collection: "soiree",
    description:
      "Graceful diamond drop earrings created for elegant evenings and celebrations.",
    price: 1980,
    images: [
      "/images/products/cat-earrings.jpg",
      "/images/products/p-earring-2.jpg",
    ],
    metals: [
      "18K Yellow Gold",
      "18K Rose Gold",
    ],
    sizes: ["One Size"],
    stock: 6,
    featured: true,
    bestseller: true,
    isNew: true,
  },
  {
    id: "product-005",
    slug: "aurelia-gold-bracelet",
    name: "Aurelia Gold Bracelet",
    category: "bracelets",
    collection: "everyday",
    description:
      "A polished gold bracelet with a clean and understated profile.",
    price: 1590,
    images: [
      "/images/products/cat-bracelets.jpg",
      "/images/products/p-bracelet-2.jpg",
    ],
    metals: [
      "18K Yellow Gold",
      "18K Rose Gold",
    ],
    sizes: ["Small", "Medium", "Large"],
    stock: 12,
    featured: true,
  },
  {
    id: "product-006",
    slug: "atelier-sapphire-ring",
    name: "Atelier Sapphire Ring",
    category: "rings",
    collection: "atelier",
    description:
      "A limited sapphire creation finished with carefully hand-set diamonds.",
    price: 4250,
    images: [
      "/images/products/p-ring-3.jpg",
      "/images/products/cat-rings.jpg",
    ],
    metals: [
      "18K White Gold",
      "Platinum",
    ],
    sizes: ["5", "6", "7", "8"],
    stock: 3,
    isNew: true,
  },
  {
    id: "product-007",
    slug: "flora-diamond-studs",
    name: "Flora Diamond Studs",
    category: "earrings",
    collection: "everyday",
    description:
      "Delicate diamond studs made for timeless everyday styling.",
    price: 1190,
    images: [
      "/images/products/p-earring-2.jpg",
      "/images/products/cat-earrings.jpg",
    ],
    metals: [
      "18K Yellow Gold",
      "18K White Gold",
    ],
    sizes: ["One Size"],
    stock: 15,
  },
  {
    id: "product-008",
    slug: "verdant-tennis-bracelet",
    name: "Verdant Tennis Bracelet",
    category: "bracelets",
    collection: "verdant",
    description:
      "Emerald and diamond stones set in an elegant continuous line.",
    price: 5490,
    images: [
      "/images/products/p-bracelet-2.jpg",
      "/images/products/cat-bracelets.jpg",
    ],
    metals: [
      "18K Yellow Gold",
      "18K White Gold",
    ],
    sizes: ["Small", "Medium", "Large"],
    stock: 4,
    featured: true,
  },
  {
    id: "product-009",
    slug: "seraphine-diamond-collar",
    name: "Seraphine Diamond Collar",
    category: "necklaces",
    collection: "soiree",
    description:
      "An articulated diamond collar created for candlelit evenings and special occasions.",
    price: 7290,
    images: [
      "/images/products/p-necklace-2.jpg",
      "/images/products/cat-necklaces.jpg",
    ],
    metals: [
      "18K White Gold",
      "Platinum",
    ],
    sizes: ["40 cm", "45 cm"],
    stock: 2,
    isNew: true,
  },
  {
    id: "product-010",
    slug: "signature-gold-band",
    name: "Signature Gold Band",
    category: "rings",
    collection: "signature",
    description:
      "A sculptural solid-gold band hand-finished in the FLĀMORÁ Melbourne atelier.",
    price: 1390,
    images: [
      "/images/products/cat-rings.jpg",
      "/images/products/p-ring-3.jpg",
    ],
    metals: [
      "18K Yellow Gold",
      "18K Rose Gold",
      "18K White Gold",
    ],
    sizes: ["5", "6", "7", "8", "9"],
    stock: 14,
  },
  {
    id: "product-011",
    slug: "atelier-diamond-cuff",
    name: "Atelier Diamond Cuff",
    category: "bracelets",
    collection: "atelier",
    description:
      "A limited sculptural cuff featuring polished gold and hand-set diamonds.",
    price: 6190,
    images: [
      "/images/products/cat-bracelets.jpg",
      "/images/products/p-bracelet-2.jpg",
    ],
    metals: [
      "18K Yellow Gold",
      "18K White Gold",
    ],
    sizes: ["Small", "Medium", "Large"],
    stock: 2,
    isNew: true,
  },
  {
    id: "product-012",
    slug: "everyday-chain-necklace",
    name: "Everyday Chain Necklace",
    category: "necklaces",
    collection: "everyday",
    description:
      "A refined solid-gold chain designed for effortless everyday layering.",
    price: 1690,
    images: [
      "/images/products/cat-necklaces.jpg",
      "/images/products/p-necklace-2.jpg",
    ],
    metals: [
      "18K Yellow Gold",
      "18K Rose Gold",
    ],
    sizes: ["40 cm", "45 cm", "50 cm"],
    stock: 11,
  },
];

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
| Product helpers
|--------------------------------------------------------------------------
*/

export function getProductBySlug(
  slug: string,
): Product | undefined {
  return products.find(
    (product) => product.slug === slug,
  );
}

export function getProductById(
  id: string,
): Product | undefined {
  return products.find(
    (product) => product.id === id,
  );
}

export function getCollectionBySlug(
  slug: string,
): Collection | undefined {
  return collections.find(
    (collection) => collection.slug === slug,
  );
}

export function getProductsByCollection(
  collectionSlug: string,
): Product[] {
  return products.filter(
    (product) =>
      product.collection === collectionSlug,
  );
}

export function getProductsByCategory(
  category: ProductCategory,
): Product[] {
  return products.filter(
    (product) =>
      product.category === category,
  );
}

export function getFeaturedProducts(): Product[] {
  return products.filter(
    (product) => product.featured,
  );
}

export function getBestSellerProducts(): Product[] {
  return products.filter(
    (product) => product.bestseller,
  );
}

export function getNewProducts(): Product[] {
  return products.filter(
    (product) => product.isNew,
  );
}

export function getRelatedProducts(
  product: Product,
  limit = 4,
): Product[] {
  const sameCollection = products.filter(
    (item) =>
      item.id !== product.id &&
      item.collection === product.collection,
  );

  const sameCategory = products.filter(
    (item) =>
      item.id !== product.id &&
      item.category === product.category &&
      !sameCollection.some(
        (relatedItem) =>
          relatedItem.id === item.id,
      ),
  );

  return [
    ...sameCollection,
    ...sameCategory,
  ].slice(0, limit);
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
/**
 * Central image registry.
 *
 * All jewellery images are stored inside:
 * public/images/products/
 *
 * Next.js serves files inside "public" from "/".
 */

export const IMAGES = {
  heroSilk: "/images/products/hero-silk.jpg",
  campaign: "/images/products/campaign.jpg",
  atelier: "/images/products/atelier.jpg",

  ring1: "/images/products/cat-rings.jpg",
  ring2: "/images/products/p-ring-2.jpg",
  ring3: "/images/products/p-ring-3.jpg",

  necklace1: "/images/products/cat-necklaces.jpg",
  necklace2: "/images/products/p-necklace-2.jpg",

  earring1: "/images/products/cat-earrings.jpg",
  earring2: "/images/products/p-earring-2.jpg",

  bracelet1: "/images/products/cat-bracelets.jpg",
  bracelet2: "/images/products/p-bracelet-2.jpg",
} as const;

export type ImageKey = keyof typeof IMAGES;
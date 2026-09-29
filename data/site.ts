export const philosophySteps = [
  {
    eyebrow: "I. THE IMPULSE",
    title: "Emotion comes first.",
    body: "A jewel begins with a feeling strong enough to deserve permanence.",
  },
  {
    eyebrow: "II. THE STONE",
    title: "Chosen for character.",
    body: "Colour, depth and brilliance are considered together. The gemstone becomes the centre of the object's gravity.",
  },
  {
    eyebrow: "III. THE ARCHITECTURE",
    title: "Built from every angle.",
    body: "Profile, negative space and proportion are refined until the jewel feels inevitable.",
  },
  {
    eyebrow: "IV. THE FINAL LIGHT",
    title: "Craft disappears into beauty.",
    body: "The polish, setting and geometry become invisible so the jewel can take over.",
  },
] as const;

export const makingSteps = [
  {
    title: "THE ATELIER.",
    caption: "I. THE ATELIER",
    description:
      "The first chapter begins at the bench — where proportion, setting and material are studied before the object becomes visible.",
    image: "/assets/atelier.jpg",
  },
  {
    title: "THE HAND.",
    caption: "II. THE HAND",
    description:
      "Stone setting and finishing are performed by hand. Pressure, alignment and polish are adjusted one fraction at a time.",
    image: "/assets/craftsmanship.png",
  },
  {
    title: "THE FINAL FORM.",
    caption: "III. THE FINAL FORM",
    description:
      "The final object is judged in light — from every profile — until metal, gemstone and reflection feel like one continuous gesture.",
    image: "/assets/emerald-ring.jpg",
  },
] as const;

export const menuItems = [
  {
    label: "HIGH JEWELLERY",
    href: "/shop",
  },
  {
    label: "RINGS",
    href: "/shop?category=rings",
  },
  {
    label: "EARRINGS",
    href: "/shop?category=earrings",
  },
  {
    label: "NECKLACES",
    href: "/shop?category=necklaces",
  },
  {
    label: "BRACELETS",
    href: "/shop?category=bracelets",
  },
] as const;

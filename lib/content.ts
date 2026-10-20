// Server-side reads of admin-managed content (CMS pages, FAQs, journal, public settings).
// Each returns null (or []) when the item doesn't exist or the API can't be reached,
// so pages can fall back gracefully instead of failing.

const API = `${process.env.API_INTERNAL_URL || "http://127.0.0.1:8001"}/api`;

export type CmsPage = { title: string; slug: string; content: string; seoTitle?: string; seoDescription?: string };
export type Faq = { _id: string; category: string; question: string; answer: string };
export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
};

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 60 } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export const getCmsPage = async (slug: string) =>
  (await get<{ item: CmsPage }>(`/cms/${encodeURIComponent(slug)}`))?.item ?? null;

export const getFaqs = async () => (await get<{ items: Faq[] }>("/faqs"))?.items ?? [];

export const getBlogPosts = async () => (await get<{ items: BlogPost[] }>("/blogs"))?.items ?? [];

export const getBlogPost = async (slug: string) =>
  (await get<{ item: BlogPost }>(`/blogs/${encodeURIComponent(slug)}`))?.item ?? null;

export const getPublicSettings = async () =>
  (await get<{ settings: Record<string, any> }>("/settings/public"))?.settings ?? {};

// Gives each <h2> an id from its text, so links like /shipping-returns#returns land on it.
export function withHeadingIds(html: string) {
  return html.replace(/<h2>([^<]+)<\/h2>/g, (_, text: string) => `<h2 id="${slugify(text)}">${text}</h2>`);
}

export const slugify = (text: string) =>
  text.toLowerCase().replace(/&[a-z]+;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

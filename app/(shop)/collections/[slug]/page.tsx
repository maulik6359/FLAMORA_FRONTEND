import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product/ProductCard";
import {
  collections,
  getCollectionBySlug,
  getProductsByCollection,
} from "@/data/products";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;

  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return {
      title: "Unavailable — FLĀMORÁ",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${collection.name} — FLĀMORÁ Jewellery`;
  const description = collection.description.slice(0, 155);

  return {
    title,
    description,

    openGraph: {
      title,
      description,
    },
  };
}

export default async function CollectionPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;

  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const items = getProductsByCollection(slug);

  return (
    <main>
      {/* Hero */}
      <header className="relative h-[62svh] min-h-[400px] overflow-hidden">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.2_0.02_160_/_0.7),transparent_65%)]" />

        <div className="relative mx-auto flex h-full max-w-[1600px] items-end px-4 pb-14 md:px-8">
          <div className="max-w-xl">
            <p className="eyebrow text-gold">
              {collection.tagline}
            </p>

            <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-none text-ivory">
              {collection.name}
            </h1>
          </div>
        </div>
      </header>

      {/* Collection content */}
      <section className="mx-auto max-w-[1600px] px-4 py-16 md:px-8">
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          {collection.description}
        </p>

        {/* Products */}
        {items.length > 0 ? (
          <div className="mt-14 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="mt-14 border border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No jewellery is currently available in this
              collection.
            </p>

            <Link
              href="/shop"
              className="mt-5 inline-block text-xs uppercase tracking-[0.18em] underline underline-offset-4"
            >
              Browse all jewellery
            </Link>
          </div>
        )}

        {/* Other collections */}
        <nav className="mt-24 border-t border-border pt-10">
          <h2 className="eyebrow">
            Other collections
          </h2>

          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {collections
              .filter(
                (item) =>
                  item.slug !== slug,
              )
              .map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/collections/${item.slug}`}
                    className="link-underline font-display text-2xl"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </section>
    </main>
  );
}
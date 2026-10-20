import type { Metadata } from "next";
import Link from "next/link";

import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description: "Stories from the FLĀMORÁ atelier: jewellery care, style guides and the making of our pieces.",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

// Published posts from Admin → Blog.
export default async function JournalPage() {
  const posts = await getBlogPosts();

  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-8 md:py-24">
          <p className="eyebrow text-gold-deep">The FLĀMORÁ Journal</p>
          <h1 className="mt-5 font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em]">
            Notes from
            <span className="block italic text-gold-deep">the atelier.</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 md:py-24">
        {posts.length === 0 ? (
          <p className="text-base leading-8 text-muted-foreground">
            New stories are on their way.{" "}
            <Link href="/shop" className="border-b border-gold-deep text-foreground">
              Explore the collection
            </Link>{" "}
            in the meantime.
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post._id} href={`/journal/${post.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden bg-silk">
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <p className="eyebrow mt-6 text-muted-foreground">{formatDate(post.publishedAt ?? post.createdAt)}</p>
                <h2 className="mt-3 font-display text-2xl leading-tight transition-colors group-hover:text-gold-deep md:text-3xl">
                  {post.title}
                </h2>
                {post.excerpt && <p className="mt-3 text-[15px] leading-7 text-muted-foreground">{post.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

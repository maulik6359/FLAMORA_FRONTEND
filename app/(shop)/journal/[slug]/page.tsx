import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getBlogPost } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function JournalPostPage({ params }: Props) {
  const post = await getBlogPost((await params).slug);
  if (!post) notFound();

  const date = new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <Link href="/journal" className="eyebrow text-muted-foreground transition-colors hover:text-foreground">
          ← The Journal
        </Link>
        <p className="eyebrow mt-10 text-gold-deep">{date}</p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] tracking-[-0.02em]">{post.title}</h1>
        {post.excerpt && <p className="mt-6 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>}
        {post.featuredImage && (
          <img src={post.featuredImage} alt="" className="mt-12 aspect-[16/10] w-full object-cover" />
        )}
        {/* Written by the store's admins in Admin → Blog. */}
        <div className="cms-content mt-12" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  );
}

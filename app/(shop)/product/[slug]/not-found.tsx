import Link from "next/link";

// Shown with HTTP 404 when page.tsx calls notFound() for an unknown or inactive piece.
export default function ProductNotFound() {
  return (
    <main className="min-h-[70vh]">
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <p className="eyebrow text-gold-deep">FLĀMORÁ</p>

        <h1 className="mt-5 font-display text-4xl">Piece not found</h1>

        <p className="mt-4 text-sm text-muted-foreground">
          The jewellery piece you are looking for is currently unavailable.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-block bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.25em] text-ivory"
        >
          Back to Collection
        </Link>
      </div>
    </main>
  );
}

"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";

export default function CreateProductPage() {
  const router = useRouter();
  return (
    <div className="max-w-4xl">
      <Link href="/admin/products" className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 hover:text-gold">← Back to products</Link>
      <h1 className="mt-4 font-display text-4xl text-neutral-100 mb-8">Create Piece</h1>
      <ProductForm onSuccess={() => router.push("/admin/products")} />
    </div>
  );
}

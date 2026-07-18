"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAuth } from "@/lib/store";
import { api } from "@/lib/api";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (!token || !params.id) return;
    api.admin.product(String(params.id), token).then((r) => setProduct(r.product));
  }, [token, params.id]);

  if (!product) return <p className="eyebrow text-neutral-500">Loading…</p>;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/products" className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 hover:text-gold">← Back to products</Link>
      <h1 className="mt-4 font-display text-4xl text-neutral-100 mb-4">Edit · {product.name}</h1>
      <Link href={`/admin/products/${product._id}/variants`} className="inline-block mb-8 text-[10px] tracking-[0.3em] uppercase text-gold border border-gold/40 px-4 py-2 hover:bg-gold hover:text-neutral-950 transition" data-testid="manage-variants-link">
        Manage Variants →
      </Link>
      <ProductForm initial={product} onSuccess={() => router.push("/admin/products")} />
    </div>
  );
}

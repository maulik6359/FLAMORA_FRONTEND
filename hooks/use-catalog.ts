"use client";

import { useEffect, useState } from "react";

import type { Product } from "@/data/products";
import { fetchCatalog } from "@/lib/catalog";

// One request serves every component on the page; it's refreshed after a minute so
// admin changes show up without a full reload.
const TTL_MS = 60_000;
let cached: { at: number; promise: Promise<Product[]> } | null = null;

function loadCatalog(): Promise<Product[]> {
  if (!cached || Date.now() - cached.at > TTL_MS) {
    const promise = fetchCatalog().catch((err) => {
      cached = null; // let the next mount retry
      throw err;
    });
    cached = { at: Date.now(), promise };
  }
  return cached.promise;
}

export function useCatalog() {
  const [state, setState] = useState<{ products: Product[]; loading: boolean; error: string | null }>({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    loadCatalog().then(
      (products) => active && setState({ products, loading: false, error: null }),
      (err: Error) => active && setState({ products: [], loading: false, error: err.message }),
    );
    return () => {
      active = false;
    };
  }, []);

  return state;
}

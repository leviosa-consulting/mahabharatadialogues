// app/products/page.tsx

import { ProductsClient } from "./ProductsClient.tsx";
import { Product } from "@/data/productsData";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (data.success) return data.data || [];

    return [];
  } catch {
    return [];
  }
}

export default async function Page() {
  const products = await getProducts();

  return <ProductsClient initialProducts={products} />;
}
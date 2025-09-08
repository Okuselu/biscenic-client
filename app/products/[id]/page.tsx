// app/products/[id]/page.tsx
import ProductDetailClient from "./productDetailsClient";

// Define which product IDs to export
export async function generateStaticParams() {
  // If your API can return all products:
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  // const products = await res.json();

  // Temporary hardcoded list (replace with dynamic API call if possible)
  const products = [
    { id: "aetheris" },
    { id: "lumivase" },
    { id: "collection-two" },
  ];

  return products.map((p) => ({ id: p.id }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient />;
}

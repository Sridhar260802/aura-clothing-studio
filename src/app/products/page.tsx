import { prisma } from "@/lib/db";
import { parseJSON } from "@/lib/utils";
import ProductsClient from "./ProductsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse our complete collection of premium clothing at Aura Clothing Studio.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; featured?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, unknown> = { active: true };

  if (params.category && params.category !== "All") {
    where.category = params.category;
  }
  if (params.search) {
    where.OR = [
      { name: { contains: params.search } },
      { description: { contains: params.search } },
      { category: { contains: params.search } },
    ];
  }
  if (params.featured === "true") {
    where.featured = true;
  }

  const products = await prisma.product.findMany({
    where: where as never,
    orderBy: { createdAt: "desc" },
  });

  const parsed = products.map((p) => ({
    ...p,
    images: parseJSON<string[]>(p.images, []),
    sizes: parseJSON<Array<{ size: string; stock: number }>>(p.sizes, []),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <ProductsClient
      products={parsed}
      initialCategory={params.category || "All"}
      initialSearch={params.search || ""}
    />
  );
}

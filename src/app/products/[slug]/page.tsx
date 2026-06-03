import { prisma } from "@/lib/db";
import { parseJSON } from "@/lib/utils";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | Aura Clothing Studio`,
      description: product.description.substring(0, 160),
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product || !product.active) {
    notFound();
  }

  // Get related products
  const related = await prisma.product.findMany({
    where: {
      active: true,
      category: product.category,
      id: { not: product.id },
    },
    take: 4,
  });

  const parse = (p: typeof product) => ({
    ...p,
    images: parseJSON<string[]>(p.images, []),
    sizes: parseJSON<Array<{ size: string; stock: number }>>(p.sizes, []),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  });

  return (
    <ProductDetailClient
      product={parse(product)}
      relatedProducts={related.map(parse)}
    />
  );
}

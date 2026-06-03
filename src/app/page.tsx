import { prisma } from "@/lib/db";
import { parseJSON } from "@/lib/utils";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const [featuredProducts, allProducts] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, featured: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { active: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const parseProd = (p: typeof featuredProducts[number]) => ({
    ...p,
    images: parseJSON<string[]>(p.images, []),
    sizes: parseJSON<Array<{ size: string; stock: number }>>(p.sizes, []),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  });

  return (
    <HomeClient
      featuredProducts={featuredProducts.map(parseProd)}
      allProducts={allProducts.map(parseProd)}
    />
  );
}

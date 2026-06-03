import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJSON } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = { active: true };

  if (category && category !== "All") {
    where.category = category;
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { category: { contains: search } },
    ];
  }
  if (featured === "true") {
    where.featured = true;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: where as never,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where: where as never }),
  ]);

  const parsed = products.map((p) => ({
    ...p,
    images: parseJSON(p.images, []),
    sizes: parseJSON(p.sizes, []),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return NextResponse.json({ products: parsed, total, page, limit });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, description, price, costPrice, category, images, sizes, stock, featured } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice || "0"),
        category,
        images: JSON.stringify(images || []),
        sizes: JSON.stringify(sizes || []),
        stock: parseInt(stock || "0"),
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

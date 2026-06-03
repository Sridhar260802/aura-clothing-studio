import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJSON } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Try finding by slug first, then by id
  let product = await prisma.product.findUnique({ where: { slug: id } });
  if (!product) {
    product = await prisma.product.findUnique({ where: { id } });
  }

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...product,
    images: parseJSON(product.images, []),
    sizes: parseJSON(product.sizes, []),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.description !== undefined) data.description = body.description;
    if (body.price !== undefined) data.price = parseFloat(body.price);
    if (body.costPrice !== undefined) data.costPrice = parseFloat(body.costPrice);
    if (body.category !== undefined) data.category = body.category;
    if (body.images !== undefined) data.images = JSON.stringify(body.images);
    if (body.sizes !== undefined) data.sizes = JSON.stringify(body.sizes);
    if (body.stock !== undefined) data.stock = parseInt(body.stock);
    if (body.featured !== undefined) data.featured = Boolean(body.featured);
    if (body.active !== undefined) data.active = Boolean(body.active);

    const product = await prisma.product.update({
      where: { id },
      data: data as never,
    });

    // Log stock change
    if (body.stock !== undefined && body.previousStock !== undefined) {
      const change = parseInt(body.stock) - parseInt(body.previousStock);
      if (change !== 0) {
        await prisma.stockLog.create({
          data: {
            productId: id,
            change,
            reason: body.stockReason || "Manual update",
          },
        });
      }
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.product.update({
    where: { id },
    data: { active: false },
  });
  return NextResponse.json({ success: true });
}

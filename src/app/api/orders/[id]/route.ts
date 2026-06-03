import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseJSON } from "@/lib/utils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let order = await prisma.order.findUnique({ where: { orderNumber: id } });
  if (!order) {
    order = await prisma.order.findUnique({ where: { id } });
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...order,
    items: parseJSON(order.items, []),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
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

    if (body.status !== undefined) data.status = body.status;
    if (body.notes !== undefined) data.notes = body.notes;
    if (body.paymentScreenshot !== undefined) data.paymentScreenshot = body.paymentScreenshot;

    const order = await prisma.order.update({
      where: { id },
      data: data as never,
    });

    return NextResponse.json({
      ...order,
      items: parseJSON(order.items, []),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

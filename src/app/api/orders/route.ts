import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOrderNumber, parseJSON } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const orderNumber = searchParams.get("orderNumber");
  const mobile = searchParams.get("mobile");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};

  if (status && status !== "All") where.status = status;
  if (search) {
    where.OR = [
      { customerName: { contains: search } },
      { orderNumber: { contains: search } },
      { mobile: { contains: search } },
    ];
  }
  if (orderNumber) where.orderNumber = orderNumber;
  if (mobile) where.mobile = mobile;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: where as never,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where: where as never }),
  ]);

  const parsed = orders.map((o) => ({
    ...o,
    items: parseJSON(o.items, []),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  return NextResponse.json({ orders: parsed, total, page, limit });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, mobile, address, city, state, pincode, items, total, paymentScreenshot } = body;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        mobile,
        address,
        city,
        state,
        pincode,
        items: JSON.stringify(items),
        subtotal: parseFloat(total),
        total: parseFloat(total),
        status: "Order Placed",
        paymentScreenshot: paymentScreenshot || null,
      },
    });

    return NextResponse.json({
      ...order,
      items: parseJSON(order.items, []),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash,
    },
  });

  // Seed products
  const products = [
    {
      name: "Midnight Velvet Blazer",
      slug: "midnight-velvet-blazer",
      description:
        "A luxurious velvet blazer crafted from premium Italian fabric. Features a slim-fit silhouette, satin-lined interior, and hand-stitched detailing. Perfect for evening occasions and upscale events.",
      price: 8999,
      costPrice: 4500,
      category: "Blazers",
      images: JSON.stringify(["/products/blazer-1.jpg"]),
      sizes: JSON.stringify([
        { size: "S", stock: 5 },
        { size: "M", stock: 8 },
        { size: "L", stock: 10 },
        { size: "XL", stock: 6 },
        { size: "XXL", stock: 3 },
      ]),
      stock: 32,
      featured: true,
    },
    {
      name: "Royal Silk Shirt",
      slug: "royal-silk-shirt",
      description:
        "Premium pure silk shirt with mother-of-pearl buttons. Features a relaxed fit with French cuffs. The fabric has a subtle sheen that catches light beautifully, making it ideal for both formal and smart-casual settings.",
      price: 4999,
      costPrice: 2200,
      category: "Shirts",
      images: JSON.stringify(["/products/shirt-1.jpg"]),
      sizes: JSON.stringify([
        { size: "S", stock: 10 },
        { size: "M", stock: 15 },
        { size: "L", stock: 12 },
        { size: "XL", stock: 8 },
        { size: "XXL", stock: 4 },
      ]),
      stock: 49,
      featured: true,
    },
    {
      name: "Classic Linen Trousers",
      slug: "classic-linen-trousers",
      description:
        "Breathable linen trousers with a tailored fit. Features a comfortable elastic waistband, deep pockets, and a clean hem. Ideal for warm-weather styling with effortless sophistication.",
      price: 3499,
      costPrice: 1500,
      category: "Trousers",
      images: JSON.stringify(["/products/trousers-1.jpg"]),
      sizes: JSON.stringify([
        { size: "S", stock: 7 },
        { size: "M", stock: 12 },
        { size: "L", stock: 14 },
        { size: "XL", stock: 9 },
        { size: "XXL", stock: 5 },
      ]),
      stock: 47,
      featured: false,
    },
    {
      name: "Embroidered Kurta Set",
      slug: "embroidered-kurta-set",
      description:
        "Hand-embroidered cotton kurta set with intricate threadwork. Includes matching churidar pants. Perfect for festive occasions and traditional celebrations with a modern twist.",
      price: 5999,
      costPrice: 2800,
      category: "Ethnic Wear",
      images: JSON.stringify(["/products/kurta-1.jpg"]),
      sizes: JSON.stringify([
        { size: "S", stock: 4 },
        { size: "M", stock: 8 },
        { size: "L", stock: 10 },
        { size: "XL", stock: 6 },
        { size: "XXL", stock: 2 },
      ]),
      stock: 30,
      featured: true,
    },
    {
      name: "Premium Denim Jacket",
      slug: "premium-denim-jacket",
      description:
        "Japanese selvedge denim jacket with a modern slim fit. Features copper rivets, adjustable cuffs, and a comfortable cotton lining. A timeless piece that improves with age.",
      price: 6499,
      costPrice: 3000,
      category: "Jackets",
      images: JSON.stringify(["/products/jacket-1.jpg"]),
      sizes: JSON.stringify([
        { size: "S", stock: 3 },
        { size: "M", stock: 7 },
        { size: "L", stock: 9 },
        { size: "XL", stock: 5 },
        { size: "XXL", stock: 2 },
      ]),
      stock: 26,
      featured: true,
    },
    {
      name: "Cashmere Crew Neck Sweater",
      slug: "cashmere-crew-neck-sweater",
      description:
        "Ultra-soft Mongolian cashmere sweater with ribbed cuffs and hem. Lightweight yet warm, with a refined silhouette. Available in deep jewel tones that complement any wardrobe.",
      price: 7499,
      costPrice: 3500,
      category: "Sweaters",
      images: JSON.stringify(["/products/sweater-1.jpg"]),
      sizes: JSON.stringify([
        { size: "S", stock: 6 },
        { size: "M", stock: 10 },
        { size: "L", stock: 8 },
        { size: "XL", stock: 4 },
        { size: "XXL", stock: 2 },
      ]),
      stock: 30,
      featured: false,
    },
    {
      name: "Tailored Chinos",
      slug: "tailored-chinos",
      description:
        "Premium stretch cotton chinos with a modern tapered fit. Features a clean front, reinforced seams, and a silky-smooth finish. Versatile enough for office or weekend wear.",
      price: 2999,
      costPrice: 1200,
      category: "Trousers",
      images: JSON.stringify(["/products/chinos-1.jpg"]),
      sizes: JSON.stringify([
        { size: "S", stock: 12 },
        { size: "M", stock: 18 },
        { size: "L", stock: 15 },
        { size: "XL", stock: 10 },
        { size: "XXL", stock: 5 },
      ]),
      stock: 60,
      featured: false,
    },
    {
      name: "Designer Polo T-Shirt",
      slug: "designer-polo-t-shirt",
      description:
        "Premium pique cotton polo with embroidered Aura monogram. Features a structured collar, three-button placket, and side vents. A refined casual essential for the modern wardrobe.",
      price: 1999,
      costPrice: 800,
      category: "T-Shirts",
      images: JSON.stringify(["/products/polo-1.jpg"]),
      sizes: JSON.stringify([
        { size: "S", stock: 15 },
        { size: "M", stock: 20 },
        { size: "L", stock: 18 },
        { size: "XL", stock: 12 },
        { size: "XXL", stock: 6 },
      ]),
      stock: 71,
      featured: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  // Create sample orders
  const sampleOrders = [
    {
      orderNumber: "AURA-0001",
      customerName: "Rahul Sharma",
      mobile: "9876543210",
      address: "123, MG Road, Sector 5",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      items: JSON.stringify([
        { productId: "1", name: "Midnight Velvet Blazer", size: "L", quantity: 1, price: 8999 },
      ]),
      subtotal: 8999,
      total: 8999,
      status: "Delivered",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      orderNumber: "AURA-0002",
      customerName: "Priya Patel",
      mobile: "9876543211",
      address: "45, Park Street",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700001",
      items: JSON.stringify([
        { productId: "2", name: "Royal Silk Shirt", size: "M", quantity: 2, price: 4999 },
      ]),
      subtotal: 9998,
      total: 9998,
      status: "Shipped",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      orderNumber: "AURA-0003",
      customerName: "Amit Kumar",
      mobile: "9876543212",
      address: "78, Brigade Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      items: JSON.stringify([
        { productId: "4", name: "Embroidered Kurta Set", size: "XL", quantity: 1, price: 5999 },
        { productId: "8", name: "Designer Polo T-Shirt", size: "XL", quantity: 1, price: 1999 },
      ]),
      subtotal: 7998,
      total: 7998,
      status: "Order Confirmed",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const order of sampleOrders) {
    await prisma.order.upsert({
      where: { orderNumber: order.orderNumber },
      update: {},
      create: order,
    });
  }

  console.log("Database seeded successfully!");
  console.log("Admin credentials: admin / admin123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

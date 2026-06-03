export interface SizeStock {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  costPrice: number;
  category: string;
  images: string[];
  sizes: SizeStock[];
  stock: number;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
  slug: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | "Order Placed"
  | "Order Confirmed"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentScreenshot: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
  "Order Placed",
  "Order Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export const CATEGORIES = [
  "All",
  "Kurta Sets",
  "CO-ORDS",
  "PARTY WEAR",
  "FESTIVE GOWNS",
  "SALWAR SUITS",
  "CASUAL MAXIS",
  "PEPLUM TOPS",
];

export const SIZES = ["S", "M", "L", "XL", "XXL"];

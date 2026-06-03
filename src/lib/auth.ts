import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function verifyAdmin(username: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { username } });
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return null;
  const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, {
    expiresIn: "7d",
  });
  return { token, admin: { id: admin.id, username: admin.username } };
}

export function signToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; username: string };
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(): Promise<{
  id: string;
  username: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAdmin() {
  const admin = await getAdminFromRequest();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}

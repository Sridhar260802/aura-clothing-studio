import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Supports both "file" (payment screenshot) and "images" (product images)
    const file = formData.get("file") as File | null;
    const images = formData.getAll("images") as File[];

    const filesToUpload = file ? [file] : images;

    if (!filesToUpload.length) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadFile = async (f: File) => {
      const blob = await put(f.name, f, {
        access: "public",
      });
      return blob.url;
    };

    const urls = await Promise.all(filesToUpload.map(uploadFile));

    // Single file (payment screenshot) → { url }
    // Multiple files (product images) → { urls }
    if (file) {
      return NextResponse.json({ url: urls[0] });
    }
    return NextResponse.json({ urls });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
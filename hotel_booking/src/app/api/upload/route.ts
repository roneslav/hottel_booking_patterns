// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // 🔥 Створюємо серверний Supabase-клієнт без cookies
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // <-- важливо
      {
        auth: {
          persistSession: false
        }
      }
    );

    const urls: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const allowed = ["jpg", "jpeg", "png", "webp", "avif", "heic"];

      if (!ext || !allowed.includes(ext)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}` },
          { status: 400 }
        );
      }

      const fileName = `${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("apartment-images")
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
          { error: "Failed to upload image", details: error.message },
          { status: 500 }
        );
      }

      const { data } = supabase.storage
        .from("apartment-images")
        .getPublicUrl(fileName);

      urls.push(data.publicUrl);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { post_id?: string; page_path?: string };
    const { post_id, page_path } = body;

    if (!page_path || typeof page_path !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const supabase = await createAdminClient();
    await supabase.from("page_views").insert({
      post_id: post_id ?? null,
      page_path: page_path.slice(0, 255),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

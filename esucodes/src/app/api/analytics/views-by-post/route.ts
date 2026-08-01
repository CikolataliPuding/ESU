import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const admin = await createAdminClient();
  const { data } = await admin
    .from("page_views")
    .select("post_id")
    .not("post_id", "is", null);

  const counts: Record<string, number> = {};
  (data ?? []).forEach((r: { post_id: string }) => {
    counts[r.post_id] = (counts[r.post_id] ?? 0) + 1;
  });

  return NextResponse.json(counts);
}

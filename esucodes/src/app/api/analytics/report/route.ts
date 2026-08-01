import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = (profile as { role: string } | null)?.role;
  if (role !== "admin" && role !== "editor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = await createAdminClient();

  const now   = new Date();
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const week  = new Date(now); week.setDate(week.getDate() - 7);

  const [totalRes, todayRes, weekRes, topRaw, dailyRaw, pagesRaw] = await Promise.all([
    admin.from("page_views").select("*", { count: "exact", head: true }),
    admin.from("page_views").select("*", { count: "exact", head: true }).gte("viewed_at", today.toISOString()),
    admin.from("page_views").select("*", { count: "exact", head: true }).gte("viewed_at", week.toISOString()),
    admin.from("page_views").select("post_id").not("post_id", "is", null),
    admin.from("page_views").select("viewed_at").gte("viewed_at", week.toISOString()),
    admin.from("page_views").select("page_path"),
  ]);

  // Aggregate top posts (all-time)
  const allCounts: Record<string, number> = {};
  (topRaw.data ?? []).forEach((r: { post_id: string | null }) => {
    if (r.post_id) allCounts[r.post_id] = (allCounts[r.post_id] ?? 0) + 1;
  });
  const topIds = Object.entries(allCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);

  let topPosts: { id: string; title: string; slug: string; views: number }[] = [];
  if (topIds.length > 0) {
    const { data: postsData } = await admin.from("posts").select("id, title, slug").in("id", topIds);
    topPosts = (postsData ?? [])
      .map((p: { id: string; title: string; slug: string }) => ({ ...p, views: allCounts[p.id] ?? 0 }))
      .sort((a, b) => b.views - a.views);
  }

  // Daily views last 7 days
  const dailyCounts: Record<string, number> = {};
  (dailyRaw.data ?? []).forEach((r: { viewed_at: string }) => {
    const d = r.viewed_at.split("T")[0];
    dailyCounts[d] = (dailyCounts[d] ?? 0) + 1;
  });
  const daily = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    return { date: dateStr, views: dailyCounts[dateStr] ?? 0 };
  });

  // Aggregate top pages by path
  const pageCounts: Record<string, number> = {};
  (pagesRaw.data ?? []).forEach((r: { page_path: string }) => {
    pageCounts[r.page_path] = (pageCounts[r.page_path] ?? 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([path, views]) => ({ path, views }));

  return NextResponse.json({
    totalViews: totalRes.count ?? 0,
    todayViews: todayRes.count ?? 0,
    weekViews:  weekRes.count  ?? 0,
    topPosts,
    topPages,
    daily,
  });
}

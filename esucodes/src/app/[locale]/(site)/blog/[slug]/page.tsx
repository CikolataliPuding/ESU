import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Clock, User, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CAT_COLORS } from "@/lib/data";
import { ViewTracker } from "./ViewTracker";

export const revalidate = 900;

type Post = {
  id: string; title: string; slug: string; excerpt: string | null;
  content: string | null; category: string; status: string;
  published_at: string | null; read_time: string | null;
  cover_image: string | null; lang: string | null;
  profiles?: { full_name: string | null; username: string | null } | null;
};

export default async function BlogPostPage({ params }: { params: { slug: string; locale: string } }) {
  const t = await getTranslations("post");
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*, profiles(full_name, username)")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (error || !post) notFound();

  const postData = post as Post;
  const cat = CAT_COLORS[postData.category] || CAT_COLORS["AI"];
  const author = postData.profiles?.full_name ?? postData.profiles?.username ?? t("team");
  const dateStr = postData.published_at
    ? new Date(postData.published_at).toLocaleDateString(
        params.locale === "en" ? "en-US" : "tr-TR",
        { day: "numeric", month: "long", year: "numeric" }
      )
    : "";

  // Fetch related posts (same category, same lang)
  const { data: related } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, category, read_time, published_at, profiles(full_name, username)")
    .eq("status", "published")
    .eq("category", postData.category)
    .eq("lang", postData.lang ?? "tr")
    .neq("slug", params.slug)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div>
      <ViewTracker postId={postData.id} path={`/blog/${params.slug}`} />

      {/* Hero */}
      <section style={{ position: "relative", padding: "80px 24px 56px", overflow: "hidden", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${cat.hex}12 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 780, margin: "0 auto" }}>
          <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, color: "var(--text-muted)", textDecoration: "none", marginBottom: 32, transition: "color 0.2s" }}>
            <ArrowLeft size={16} /> {t("backToBlog")}
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 9999, background: cat.hex + "20", border: `1px solid ${cat.hex}40`, color: cat.hex, letterSpacing: "0.06em" }}>
              {postData.category}
            </span>
            {postData.read_time && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                <Clock size={13} /> {postData.read_time}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1.25, margin: "0 0 20px" }}>
            {postData.title}
          </h1>

          {postData.excerpt && (
            <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 28px", maxWidth: 660 }}>
              {postData.excerpt}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9999, background: `linear-gradient(135deg, ${cat.hex}40, ${cat.hex}80)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: cat.hex, boxShadow: `0 0 16px ${cat.hex}30` }}>
              {author[0]}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{author}</div>
              {dateStr && <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{dateStr}</div>}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px 80px" }}>
        {postData.content ? (
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: postData.content }}
            style={{ color: "var(--text-primary)", lineHeight: 1.8, fontSize: 17 }}
          />
        ) : (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "60px 0" }}>
            <BookOpen size={40} style={{ marginBottom: 16 }} /><br />
            {t("backToBlog")}
          </p>
        )}

        {/* Helpful CTA */}
        <div style={{ marginTop: 64, padding: "36px 32px", borderRadius: 20, background: `linear-gradient(135deg, ${cat.hex}10, ${cat.hex}06)`, border: `1px solid ${cat.hex}25`, textAlign: "center" }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px" }}>{t("helpful")}</p>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", margin: "0 0 20px", lineHeight: 1.6 }}>{t("helpfulSub")}</p>
          <Link href="/katil" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, background: cat.hex, color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
            {t("follow")}
          </Link>
        </div>
      </section>

      {/* Related posts */}
      {related && related.length > 0 && (
        <section style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 24px 80px" }}>
          <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 56 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 32px" }}>{t("relatedPosts")}</h2>
            <div className="grid-3" style={{ gap: 24 }}>
              {(related as Post[]).map((rp) => {
                const rcat = CAT_COLORS[rp.category] || CAT_COLORS["AI"];
                const rauthor = rp.profiles?.full_name ?? rp.profiles?.username ?? t("team");
                return (
                  <Link key={rp.id} href={`/blog/${rp.slug}`} style={{ display: "flex", flexDirection: "column", textDecoration: "none", borderRadius: 16, overflow: "hidden", background: "var(--glass-fill)", border: "1px solid var(--border-subtle)", transition: "border-color 0.2s" }}>
                    <div style={{ height: 3, background: `linear-gradient(90deg, ${rcat.hex}, transparent)` }} />
                    <div style={{ padding: "20px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 9999, background: rcat.hex + "20", color: rcat.hex }}>{rp.category}</span>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "10px 0 8px", lineHeight: 1.35 }}>{rp.title}</h3>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>{rp.excerpt}</p>
                      <div style={{ marginTop: 14, fontSize: 12, color: "var(--text-muted)" }}>{rauthor} · {rp.read_time}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

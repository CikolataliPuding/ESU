import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Code2, Link2, BookOpen, FolderOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CAT_COLORS } from "@/lib/data";

export const revalidate = 300;

type TeamMember = {
  id: string; name: string; role_title: string; bio: string | null;
  skills: string[] | null; github_url: string | null; linkedin_url: string | null;
  username: string; profile_id: string | null;
};

type Post = {
  id: string; title: string; slug: string; excerpt: string | null;
  category: string; read_time: string | null; published_at: string | null;
};

type Project = {
  id: string; name: string; tagline: string | null; tech: string[] | null;
  status: string; github_url: string | null; live_url: string | null;
  icon: string | null; accent_color: string | null;
};

const MEMBER_COLORS = ["#818cf8", "#22d3ee", "#a78bfa"];
function getMemberColor(name: string) {
  return MEMBER_COLORS[name.charCodeAt(0) % MEMBER_COLORS.length];
}

function formatDate(dateStr: string | null, locale: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(locale === "en" ? "en-US" : "tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function MemberProfilePage({
  params,
}: {
  params: { username: string; locale: string };
}) {
  const t = await getTranslations("memberProfile");
  const supabase = await createClient();

  const { data: member, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("username", params.username)
    .single();

  if (error || !member) notFound();

  const m = member as TeamMember;
  const color = getMemberColor(m.name);

  // Fetch this member's published posts via profile_id FK
  let posts: Post[] = [];
  if (m.profile_id) {
    const { data: postsData } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, category, read_time, published_at")
      .eq("author_id", m.profile_id)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    posts = (postsData as Post[]) ?? [];
  }

  // Fetch team projects (public only)
  const { data: projectsData } = await supabase
    .from("projects")
    .select("id, name, tagline, tech, status, github_url, live_url, icon, accent_color")
    .neq("status", "private")
    .order("order_index");
  const projects = (projectsData as Project[]) ?? [];

  return (
    <div>
      {/* Back link */}
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "40px 24px 0" }}>
        <Link
          href="/murettebat"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--text-muted)", textDecoration: "none" }}
        >
          <ArrowLeft size={16} /> {t("backToTeam")}
        </Link>
      </div>

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", padding: "48px 24px 56px", borderBottom: "1px solid var(--border-subtle)", marginTop: 32 }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 70% at 20% 50%, ${color}0e 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: "var(--container-max)", margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 36, flexWrap: "wrap" }}>

          {/* Avatar */}
          <div style={{ width: 96, height: 96, borderRadius: 9999, flexShrink: 0, background: `linear-gradient(135deg, ${color}30, ${color}70)`, border: `2px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 900, color, boxShadow: `0 0 48px ${color}22` }}>
            {m.name[0]}
          </div>

          {/* Name + role + social */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px", fontFamily: "var(--font-mono)" }}>
              {m.role_title}
            </p>
            <h1 style={{ fontSize: "clamp(26px, 4vw, 46px)", fontWeight: 900, color: "var(--text-primary)", margin: "0 0 20px", lineHeight: 1.15 }}>
              {m.name}
            </h1>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {m.github_url && (
                <a href={m.github_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 10, background: "var(--glass-fill)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", textDecoration: "none" }}>
                  <Code2 size={14} /> {t("github")}
                </a>
              )}
              {m.linkedin_url && (
                <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 10, background: "var(--glass-fill)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", textDecoration: "none" }}>
                  <Link2 size={14} /> {t("linkedin")}
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 12, flexShrink: 0, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center", padding: "16px 24px", background: "var(--glass-fill)", border: "1px solid var(--border-subtle)", borderRadius: 14 }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{posts.length}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{t("postsCount")}</div>
            </div>
            <div style={{ textAlign: "center", padding: "16px 24px", background: "var(--glass-fill)", border: "1px solid var(--border-subtle)", borderRadius: 14 }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>{m.skills?.length ?? 0}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{t("skillsCount")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "56px 24px 80px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 32, alignItems: "start" }}>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {m.bio && (
            <div style={{ padding: "20px", background: "var(--glass-fill)", border: "1px solid var(--border-subtle)", borderRadius: 16 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>
                {t("about")}
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{m.bio}</p>
            </div>
          )}

          {m.skills && m.skills.length > 0 && (
            <div style={{ padding: "20px", background: "var(--glass-fill)", border: "1px solid var(--border-subtle)", borderRadius: 16 }}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>
                {t("skills")}
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {m.skills.map((skill) => (
                  <span key={skill} style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 9999, background: `${color}18`, border: `1px solid ${color}35`, color, fontFamily: "var(--font-mono)" }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

          {/* Blog posts */}
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
              <BookOpen size={19} color={color} />
              {t("posts")}
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)" }}>({posts.length})</span>
            </h2>

            {posts.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 14, padding: "20px 0" }}>{t("noPosts")}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {posts.map((post) => {
                  const cat = CAT_COLORS[post.category] || CAT_COLORS["AI"];
                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", background: "var(--glass-fill)", border: "1px solid var(--border-subtle)", borderRadius: 14, textDecoration: "none" }}
                    >
                      <div style={{ width: 3, height: 44, borderRadius: 3, background: cat.hex, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {post.title}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                          {formatDate(post.published_at, params.locale)}{post.read_time ? ` · ${post.read_time}` : ""}
                        </p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", background: `${cat.hex}20`, color: cat.hex, borderRadius: 6, flexShrink: 0, fontFamily: "var(--font-mono)" }}>
                        {post.category}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Team projects */}
          {projects.length > 0 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
                <FolderOpen size={19} color={color} />
                {t("teamProjects")}
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
                {projects.map((proj) => {
                  const accent = proj.accent_color || color;
                  return (
                    <div key={proj.id} style={{ padding: "18px", background: "var(--glass-fill)", border: "1px solid var(--border-subtle)", borderRadius: 14 }}>
                      <div style={{ fontSize: 22, marginBottom: 10 }}>{proj.icon ?? "🚀"}</div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>{proj.name}</p>
                      {proj.tagline && (
                        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 10px", lineHeight: 1.5 }}>{proj.tagline}</p>
                      )}
                      {proj.tech && proj.tech.length > 0 && (
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {proj.tech.slice(0, 3).map((tech) => (
                            <span key={tech} style={{ fontSize: 10, padding: "2px 6px", background: `${accent}18`, color: accent, borderRadius: 4, fontFamily: "var(--font-mono)" }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

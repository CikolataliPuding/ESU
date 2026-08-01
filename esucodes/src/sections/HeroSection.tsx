"use client";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { BookOpen, FolderOpen } from "lucide-react";
import { HeroScene } from "@/components/HeroScene";

export function HeroSection() {
  const t    = useTranslations("hero");
  const full = "ESUCODES";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(t);
    }, 140);
    return () => clearInterval(t);
  }, []);

  return (
    <section style={{
      position: "relative", minHeight: 700,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", textAlign: "center", padding: "80px 24px 100px",
    }}>
      <HeroScene />

      {/* Black hole overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 18% 12% at 50% 48%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 40%, transparent 100%)",
      }} />

      {/* Bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 180,
        background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)",
        pointerEvents: "none", zIndex: 2,
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 880 }}>
        {/* Live badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
          padding: "6px 20px", borderRadius: 9999,
          background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.35)",
          backdropFilter: "blur(8px)",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: 9999, background: "var(--accent-tertiary)",
            boxShadow: "0 0 8px var(--accent-tertiary)",
            animation: "esu-pulse 2s ease-in-out infinite",
            display: "inline-block",
          }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-tertiary)", letterSpacing: "0.08em" }}>
            {t("badge")}
          </span>
        </div>

        {/* Typed title */}
        <div style={{ fontSize: "clamp(56px, 12vw, 116px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: 0 }}>
          <span style={{
            background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #22d3ee 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 40px rgba(129,140,248,0.5))",
          }}>
            {typed}
          </span>
          <span style={{
            background: "linear-gradient(135deg, #818cf8, #22d3ee)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "esu-caret 1s steps(1) infinite",
          }}>|</span>
        </div>

        {/* Slogan */}
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px, 4vw, 48px)", margin: "20px 0 0" }}>
          {(t.raw("words") as string[]).map((word, i) => (
            <span key={word} style={{
              fontSize: "clamp(15px, 2vw, 22px)", fontWeight: 800, letterSpacing: "0.04em",
              background: [
                "linear-gradient(135deg, #818cf8, #a78bfa)",
                "linear-gradient(135deg, #a78bfa, #22d3ee)",
                "linear-gradient(135deg, #22d3ee, #34d399)",
              ][i],
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              opacity: 0.92,
            }}>
              {word}
            </span>
          ))}
        </div>

        <p style={{
          fontSize: "clamp(15px, 2vw, 19px)", color: "var(--text-secondary)",
          margin: "28px auto 40px", lineHeight: 1.75, maxWidth: 560,
        }}>
          {t("description")}<br />
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{t("descriptionHighlight")}</span>
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/blog" style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "13px 28px", borderRadius: 12, textDecoration: "none",
            background: "var(--accent-primary)", color: "var(--bg-primary)",
            fontSize: 16, fontWeight: 700, transition: "opacity 0.2s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            <BookOpen size={20} /> {t("exploreBlog")}
          </Link>
          <Link href="/projeler" style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "13px 28px", borderRadius: 12, textDecoration: "none",
            background: "var(--glass-fill)", border: "1px solid var(--border-subtle)",
            color: "var(--text-primary)", fontSize: 16, fontWeight: 700,
            backdropFilter: "blur(8px)", transition: "border-color 0.2s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}>
            <FolderOpen size={20} /> {t("exploreProjects")}
          </Link>
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: 56, display: "flex", justifyContent: "center" }}>
          <div style={{
            width: 24, height: 40, border: "2px solid rgba(129,140,248,0.35)", borderRadius: 9999,
            display: "flex", justifyContent: "center", paddingTop: 8,
          }}>
            <span style={{
              width: 4, height: 10, borderRadius: 9999, background: "var(--accent-primary)",
              animation: "esu-scroll 2s ease-in-out infinite",
              display: "block",
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useState, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Rocket, Eye, Share2, Compass, Users, Mail } from "lucide-react";
import { VALUES } from "@/lib/data";
import { GradientHeading } from "@/components/GradientHeading";
import { ScrollReveal } from "@/components/ScrollReveal";

const ICONS: Record<string, React.ElementType> = { Rocket, Eye, Share2, Compass, Users };

function GlowCard({ children, glowColor = "rgba(129,140,248,0.15)" }: { children: ReactNode; glowColor?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 20,
        background: "var(--glass-fill)",
        border: `1px solid ${hover ? glowColor.replace(/[\d.]+\)$/, "0.35)") : "var(--border-subtle)"}`,
        transition: "box-shadow 0.35s ease, border-color 0.35s ease",
        boxShadow: hover ? `0 0 48px ${glowColor}, 0 8px 32px rgba(0,0,0,0.3)` : `0 0 20px ${glowColor.replace(/[\d.]+\)$/, "0.06)")}`,
      }}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", padding: "100px 24px 72px", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.14) 0%, rgba(129,140,248,0.06) 50%, transparent 100%)", pointerEvents: "none" }} />
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: `${(i * 43 + 7) % 100}%`, top: `${(i * 67 + 11) % 100}%`, width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: 9999, background: "white", opacity: 0.08 + (i % 5) * 0.04, pointerEvents: "none" }} />
        ))}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 720, margin: "0 auto" }}>
          <GradientHeading as="h1" size="7xl" gradient="galactic" align="center" glow>{t("title")}</GradientHeading>
          <p style={{ fontSize: 20, color: "var(--text-secondary)", marginTop: 20, lineHeight: 1.7 }}>
            {t("subtitle")}<br />
            <span style={{ color: "var(--accent-primary)" }}>{t("subtitleHighlight")}</span>
          </p>
        </div>
      </section>

      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 24px 96px" }}>
        {/* Story intro */}
        <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.75, textAlign: "center", maxWidth: 680, margin: "0 auto 64px" }}>
          {t("intro")}
        </p>

        {/* Mission + Vision */}
        <ScrollReveal>
          <div className="grid-2" style={{ gap: 24, marginBottom: 80 }}>
            <GlowCard glowColor="rgba(129,140,248,0.18)">
              <div style={{ padding: "36px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 8, height: 36, borderRadius: 9999, background: "var(--accent-primary)", boxShadow: "0 0 12px rgba(129,140,248,0.6)", flexShrink: 0 }} />
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{t("mission")}</h2>
                </div>
                <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.75, margin: "0 0 20px" }}>
                  {t("missionText")}
                </p>
                <blockquote style={{ fontSize: 16, fontStyle: "italic", color: "var(--text-primary)", borderLeft: "3px solid var(--accent-primary)", paddingLeft: 18, margin: 0, lineHeight: 1.7 }}>
                  {t("missionQuote")}
                </blockquote>
              </div>
            </GlowCard>

            <GlowCard glowColor="rgba(34,211,238,0.15)">
              <div style={{ padding: "36px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 8, height: 36, borderRadius: 9999, background: "var(--accent-tertiary)", boxShadow: "0 0 12px rgba(34,211,238,0.6)", flexShrink: 0 }} />
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>{t("vision")}</h2>
                </div>
                <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.75, margin: "0 0 16px" }}>
                  {t("visionText1")}
                </p>
                <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>
                  {t("visionText2")}
                </p>
              </div>
            </GlowCard>
          </div>
        </ScrollReveal>

        {/* Values */}
        <ScrollReveal delay={0.2}>
          <div style={{ marginBottom: 80 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontSize: 36, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 12px" }}>{t("values")}</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 17 }}>{t("valuesSubtitle")}</p>
            </div>
            <div className="grid-3" style={{ gap: 20 }}>
              {VALUES.map((v) => {
                const Icon = ICONS[v.icon] || Rocket;
                return (
                  <GlowCard key={v.title} glowColor={v.color + "26"}>
                    <div style={{ padding: "28px 24px" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, marginBottom: 18, background: v.color + "18", border: `1px solid ${v.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={24} color={v.color} />
                      </div>
                      <h3 style={{ fontSize: 20, fontWeight: 800, color: v.color, margin: "0 0 10px" }}>{v.title}</h3>
                      <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: 0 }}>{v.text}</p>
                    </div>
                  </GlowCard>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom CTA */}
        <div style={{ borderRadius: 24, padding: "56px 40px", textAlign: "center", background: "linear-gradient(135deg, rgba(129,140,248,0.10) 0%, rgba(34,211,238,0.07) 100%)", border: "1px solid rgba(129,140,248,0.20)" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🛸</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 12px" }}>{t("ctaTitle")}</h2>
          <p style={{ fontSize: 17, color: "var(--text-secondary)", margin: "0 0 32px", lineHeight: 1.65, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            {t("ctaSubtitle")}
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/katil" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, textDecoration: "none", background: "var(--accent-primary)", color: "var(--bg-primary)", fontSize: 15, fontWeight: 700 }}>
              <Mail size={18} /> {t("contactUs")}
            </Link>
            <Link href="/murettebat" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, textDecoration: "none", background: "var(--glass-fill)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: 15, fontWeight: 700, backdropFilter: "blur(8px)" }}>
              <Users size={18} /> {t("meetTeam")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

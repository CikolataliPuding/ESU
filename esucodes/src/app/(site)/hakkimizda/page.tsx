"use client";
import { useState, ReactNode } from "react";
import Link from "next/link";
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
  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", padding: "100px 24px 72px", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.14) 0%, rgba(129,140,248,0.06) 50%, transparent 100%)", pointerEvents: "none" }} />
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: `${(i * 43 + 7) % 100}%`, top: `${(i * 67 + 11) % 100}%`, width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: 9999, background: "white", opacity: 0.08 + (i % 5) * 0.04, pointerEvents: "none" }} />
        ))}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 720, margin: "0 auto" }}>
          <GradientHeading as="h1" size="7xl" gradient="galactic" align="center" glow>Hakkımızda</GradientHeading>
          <p style={{ fontSize: 20, color: "var(--text-secondary)", marginTop: 20, lineHeight: 1.7 }}>
            Yazılım evrenini keşfetmeye çıkan üç öğrencinin hikayesi.<br />
            <span style={{ color: "var(--accent-primary)" }}>Küçük ekip. Büyük merak. Sonsuz evren.</span>
          </p>
        </div>
      </section>

      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 24px 96px" }}>
        {/* Story intro */}
        <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.75, textAlign: "center", maxWidth: 680, margin: "0 auto 64px" }}>
          Her şey tek bir soruyla başladı: &ldquo;Kendi web siten olduğunu hayal ettin mi hiç?&rdquo; Cevap kısaydı — &ldquo;olur.&rdquo; Üç yazılım öğrencisi, bildiklerini kendine saklamanın anlamsızlığında birleşti ve gerisi, merakın peşinden gitmekten ibaretti.
        </p>

        {/* Mission + Vision */}
        <ScrollReveal>
          <div className="grid-2" style={{ gap: 24, marginBottom: 80 }}>
            <GlowCard glowColor="rgba(129,140,248,0.18)">
              <div style={{ padding: "36px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 8, height: 36, borderRadius: 9999, background: "var(--accent-primary)", boxShadow: "0 0 12px rgba(129,140,248,0.6)", flexShrink: 0 }} />
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Misyonumuz</h2>
                </div>
                <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.75, margin: "0 0 20px" }}>
                  Öğrendiğimizi saklamak yerine,{" "}
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>anlaşılır ve samimi</span> bir dille geri vermek. Bugün üç öğrenci olarak yazıyor, üretiyor ve bu platformu her gün biraz daha büyütüyoruz. Derdimiz parlamak değil; gerçekten öğrenen ve öğrendiğini aktaran bir yer olmak.
                </p>
                <blockquote style={{ fontSize: 16, fontStyle: "italic", color: "var(--text-primary)", borderLeft: "3px solid var(--accent-primary)", paddingLeft: 18, margin: 0, lineHeight: 1.7 }}>
                  &ldquo;Bilgi biriktirilmek için değil, yayılmak için vardır.&rdquo;
                </blockquote>
              </div>
            </GlowCard>

            <GlowCard glowColor="rgba(34,211,238,0.15)">
              <div style={{ padding: "36px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 8, height: 36, borderRadius: 9999, background: "var(--accent-tertiary)", boxShadow: "0 0 12px rgba(34,211,238,0.6)", flexShrink: 0 }} />
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>Vizyonumuz</h2>
                </div>
                <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.75, margin: "0 0 16px" }}>
                  Kimi yapılar çevresini iter, kimileri çeker. Biz ikincisinden olmak istiyoruz — yazılım evreninde dağılmış ne varsa{" "}
                  <span style={{ color: "var(--accent-tertiary)", fontWeight: 700 }}>yavaşça kendine toplayan, yaklaştıkça bırakmayan bir merkez</span>. Bilgi, er ya da geç yörüngemize girer; biz de onu içimize alır, kendimizin kılarız. Büyüdükçe çekim gücümüz artar.
                </p>
                <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>
                  Bugün üçüz. Ama ufkumuzda daha kalabalık bir şey var: yazılım öğrencilerinin bir araya geldiği, projelerini yönettiği, yazdığını paylaştığı, birbirine değdiği ve belki yollarını çizdiği bir merkez. Henüz küçük bir çekirdeğiz — ama merkezler hep küçük başlar. Sen de bu çekim alanına kapılabilirsin.
                </p>
              </div>
            </GlowCard>
          </div>
        </ScrollReveal>

        {/* Values */}
        <ScrollReveal delay={0.2}>
          <div style={{ marginBottom: 80 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <h2 style={{ fontSize: 36, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 12px" }}>Değerlerimiz</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 17 }}>Bizi bir arada tutan prensipler</p>
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
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 12px" }}>Evren Hakkında Konuşalım</h2>
          <p style={{ fontSize: 17, color: "var(--text-secondary)", margin: "0 0 32px", lineHeight: 1.65, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            Sorularınız, önerileriniz veya iş birliği teklifleriniz için bize ulaşın.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/katil" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, textDecoration: "none", background: "var(--accent-primary)", color: "var(--bg-primary)", fontSize: 15, fontWeight: 700 }}>
              <Mail size={18} /> Bizimle İletişime Geç
            </Link>
            <Link href="/murettebat" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, textDecoration: "none", background: "var(--glass-fill)", border: "1px solid var(--border-subtle)", color: "var(--text-primary)", fontSize: 15, fontWeight: 700, backdropFilter: "blur(8px)" }}>
              <Users size={18} /> Mürettebatı Keşfet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

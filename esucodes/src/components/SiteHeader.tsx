"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Terminal, LogOut, LayoutDashboard, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SiteHeader() {
  const t        = useTranslations();
  const locale   = useLocale();
  const pathname = usePathname();
  const router   = useRouter();

  const [loggedIn, setLoggedIn]         = useState(false);
  const [canAccessAdmin, setCanAccessAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
      if (!session) { setCanAccessAdmin(false); return; }
      fetch("/api/auth/is-admin")
        .then((res) => res.json())
        .then((data: { isAdmin: boolean }) => setCanAccessAdmin(data.isAdmin))
        .catch(() => setCanAccessAdmin(false));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  };

  const switchLocale = () => {
    router.replace(pathname, { locale: locale === "tr" ? "en" : "tr" });
  };

  const navItems = [
    { id: "projects", label: t("nav.projects"), href: "/projeler" as const },
    { id: "blog",     label: t("nav.blog"),     href: "/blog"     as const },
    { id: "team",     label: t("nav.team"),     href: "/murettebat" as const },
    { id: "about",    label: t("nav.about"),    href: "/hakkimizda" as const },
    { id: "join",     label: t("nav.join"),     href: "/katil"    as const },
  ] as const;

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(15,23,42,0.88)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border-subtle)",
    }}>
      <div style={{
        maxWidth: "var(--container-max)", margin: "0 auto",
        padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span className="esu-gradient-text" style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em" }}>
            ESUCODES
          </span>
        </Link>

        <nav className="desktop-only-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {navItems.map((item) => (
            <NavLink key={item.id} href={item.href} active={pathname === item.href} highlight={item.id === "join"}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Language switcher */}
          <button
            onClick={switchLocale}
            title={locale === "tr" ? "Switch to English" : "Türkçe'ye geç"}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 9999,
              background: "var(--glass-fill)", border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)", fontSize: 13, fontWeight: 700,
              cursor: "pointer", transition: "all 0.2s",
              fontFamily: "var(--font-mono)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-primary)"; e.currentTarget.style.color = "var(--accent-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            <Globe size={13} />
            {locale === "tr" ? "EN" : "TR"}
          </button>

          {loggedIn ? (
            <>
              {canAccessAdmin && (
                <a href="/admin" style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 16px", borderRadius: 9999,
                  background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.4)",
                  color: "var(--accent-primary)", fontSize: 14, fontWeight: 700, textDecoration: "none",
                  transition: "all 0.22s ease",
                }}>
                  <LayoutDashboard size={16} /> {t("header.dashboard")}
                </a>
              )}
              <button onClick={handleLogout} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 16px", borderRadius: 9999,
                background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.4)",
                color: "#f87171", fontSize: 14, fontWeight: 700,
                cursor: "pointer", transition: "all 0.22s ease",
              }}>
                <LogOut size={16} /> {t("header.signout")}
              </button>
            </>
          ) : (
            <Link href="/giris" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 16px", borderRadius: 9999,
              background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.4)",
              color: "var(--accent-tertiary)", fontSize: 14, fontWeight: 700, textDecoration: "none",
              transition: "all 0.22s ease",
            }}>
              <Terminal size={16} /> {t("header.signin")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({ children, href, active, highlight }: {
  children: React.ReactNode;
  href: string;
  active: boolean;
  highlight?: boolean;
}) {
  const [hover, setHover] = useState(false);

  if (highlight) {
    return (
      <Link href={href as "/"} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        background: active ? "var(--accent-primary)" : hover ? "rgba(129,140,248,0.15)" : "transparent",
        border: `1px solid ${active ? "var(--accent-primary)" : "rgba(129,140,248,0.4)"}`,
        borderRadius: 9999, padding: "5px 16px",
        fontSize: 14, fontWeight: 700, textDecoration: "none",
        color: active ? "var(--bg-primary)" : "var(--accent-primary)",
        transition: "all var(--dur-base)",
      }}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={href as "/"} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      position: "relative", textDecoration: "none",
      fontSize: 15, padding: "4px 0",
      color: active || hover ? "var(--text-primary)" : "var(--text-secondary)",
      transition: "color var(--dur-base)",
    }}>
      {children}
      <span style={{
        position: "absolute", bottom: -2, left: 0, height: 2, borderRadius: 2,
        width: active || hover ? "100%" : 0, background: "var(--accent-primary)",
        transition: "width var(--dur-base)", display: "block",
      }} />
    </Link>
  );
}

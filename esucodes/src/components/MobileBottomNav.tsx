"use client";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, FolderOpen, BookOpen, Users, UserPlus } from "lucide-react";

export function MobileBottomNav() {
  const t        = useTranslations("mobile");
  const pathname = usePathname();

  const items = [
    { href: "/",           Icon: Home,       label: t("home") },
    { href: "/projeler",   Icon: FolderOpen, label: t("projects") },
    { href: "/blog",       Icon: BookOpen,   label: t("blog") },
    { href: "/murettebat", Icon: Users,      label: t("team") },
    { href: "/katil",      Icon: UserPlus,   label: t("join") },
  ] as const;

  return (
    <nav className="mob-bottom-nav">
      {items.map(({ href, Icon, label }) => {
        const active = pathname === href;
        return (
          <Link key={href} href={href} className={`mob-nav-item${active ? " mob-active" : ""}`}>
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

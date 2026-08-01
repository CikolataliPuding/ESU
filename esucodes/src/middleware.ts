import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import type { Role } from "@/lib/supabase/types";

const handleI18n = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Production'da HTTP → HTTPS zorunlu yönlendirme
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http"
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, { status: 301 });
  }

  const { pathname } = request.nextUrl;

  // 2. Admin rotaları: tam auth + cookie yönetimi
  if (pathname.startsWith("/admin")) {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL("/giris", request.url));

    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const role = (data as { role: Role } | null)?.role ?? "member";
    if (role !== "editor" && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return supabaseResponse;
  }

  // 3. Giriş sayfasında oturum açmış admin'i /admin'e yönlendir
  //    (/giris ve /en/giris her ikisini de kontrol et)
  if (pathname === "/giris" || pathname === "/en/giris") {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll() {},
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      const role = (data as { role: Role } | null)?.role ?? "member";
      if (role === "editor" || role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  // 4. Geri kalan her şey: next-intl dil yönlendirmesi
  return handleI18n(request);
}

export const config = {
  matcher: [
    // Exclude: _next, _vercel, api routes, static files
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/admin/:path*",
  ],
};

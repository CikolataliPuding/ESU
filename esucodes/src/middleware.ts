import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Role } from "@/lib/supabase/types";

// NOT: middleware Edge runtime'da next/headers'ın cookies() API'sini kullanamıyor, bu yüzden
// lib/auth.ts'teki getSessionRole() burada çağrılamıyor (route handler/server component'lerin
// cookie adaptörü middleware'inkinden farklı). Aynı "profiles.role oku" sorgusu burada
// bilinçli olarak yeniden yazıldı — bu, Next.js'in middleware/route-handler sınırından
// kaynaklanan, kabul edilmiş tek istisna.
export async function middleware(request: NextRequest) {
  // Production'da HTTP → HTTPS zorunlu yönlendirme
  // Vercel/proxy arkasında x-forwarded-proto header'ı orijinal protokolü söyler
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") === "http"
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, { status: 301 });
  }

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

  const getRole = async (): Promise<Role> => {
    if (!user) return "member";
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    return (data as { role: Role } | null)?.role ?? "member";
  };

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/giris", request.url));
    }
    const role = await getRole();
    if (role !== "editor" && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Giriş yapmış editor/admin /giris'e gelirse direkt /admin'e yönlendir
  if (request.nextUrl.pathname === "/giris" && user) {
    const role = await getRole();
    if (role === "editor" || role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/giris"],
};

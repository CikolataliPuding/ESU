/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Tarayıcıyı 2 yıl boyunca sadece HTTPS kullanmaya zorla (SSL stripping'i engeller)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Sayfanın iframe içinde gösterilmesini engelle (clickjacking koruması)
  { key: "X-Frame-Options", value: "DENY" },
  // Tarayıcının MIME tipini tahmin etmesini engelle
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer bilgisini cross-origin isteklerde minimumda tut
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Gereksiz tarayıcı özelliklerini kapat
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Eski tarayıcılar için XSS filtresi
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // DNS prefetch açık bırak (performans için)
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

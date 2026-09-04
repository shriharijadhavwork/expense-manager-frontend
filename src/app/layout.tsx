import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { appConfig } from "@/config/env";
import "./globals.css";

// Inter — the proven fintech/product-UI choice (Razorpay's Blade design
// system, GoCardless, Linear, GitHub, Figma). Tall x-height and open
// apertures keep it legible at the small sizes financial UI leans on.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Kept for tabular currency figures — a dedicated mono face reads cleaner
// for amounts than falling back to a generic system mono.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appConfig.appName,
    template: `%s · ${appConfig.appName}`,
  },
  description: appConfig.tagline,
};

const themeBootScript = `
(function(){
  try {
    var key = 'expense-manager.theme';
    var stored = localStorage.getItem(key) || 'system';
    var dark = stored === 'dark' || (stored === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

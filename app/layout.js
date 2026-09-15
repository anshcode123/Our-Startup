import "./globals.css";
import { Inter } from "next/font/google";
import { SmoothScroll, ScrollProgress } from "@/components/scroll";
import CustomCursor from "@/components/ui/CustomCursor";
import { SITE_URL } from "@/lib/siteConfig";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_TITLE = "AKIVRO.dev — We Build Digital Products";
const SITE_DESCRIPTION =
  "AKIVRO.dev designs and develops modern websites, mobile apps, and custom software for businesses ready to move forward.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — AKIVRO.dev",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "AKIVRO.dev",
    type: "website",
    // Image itself comes from app/opengraph-image.jsx (Next's file-based
    // convention adds it automatically) — a generated brand/tagline card,
    // not a fake screenshot or stats graphic.
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // Image comes from app/twitter-image.jsx, same convention as above.
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SmoothScroll>
          <ScrollProgress />
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

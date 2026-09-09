import "./globals.css";
import { Inter } from "next/font/google";
import { SmoothScroll, ScrollProgress } from "@/components/scroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_TITLE = "Anshul.dev — We Build Digital Products";
const SITE_DESCRIPTION =
  "Anshul.dev designs and develops modern websites, mobile apps, and custom software for businesses.";

// TODO: replace with the real production domain once one exists — this
// only affects how relative URLs in metadata (e.g. Open Graph) resolve.
const SITE_URL = "https://anshul.dev";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Anshul.dev",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Anshul.dev",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SmoothScroll>
          <ScrollProgress />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

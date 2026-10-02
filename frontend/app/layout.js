import "./globals.css";
import { Inter } from "next/font/google";
import { SmoothScroll, ScrollProgress } from "@/components/scroll";
import CustomCursor from "@/components/ui/CustomCursor";
import ThemeProvider from "@/components/theme/ThemeProvider";
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
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("anshul_theme")||"dark";document.documentElement.setAttribute("data-theme",t);document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <SmoothScroll>
            <ScrollProgress />
            <CustomCursor />
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
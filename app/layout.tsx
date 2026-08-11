import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Montserrat } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/language-provider";
import "./globals.css";

/**
 * Montserrat stands in for Gotham (the brand's licensed Latin face) — see the
 * substitution note in `colors_and_type.css`. IBM Plex Sans Arabic carries the
 * RTL side, since Montserrat has no Arabic coverage.
 */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  // Gotham Light / Book / Medium / Bold, in Montserrat's weights.
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  // Unlike Montserrat, Plex Arabic ships one file per weight. The page is
  // English on first paint, so preloading four Arabic faces would cost every
  // visitor for a face most never see — it loads when the guest switches.
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Entrecôte Café de Paris — Chez Boubier 1930",
    template: "%s · Entrecôte Café de Paris",
  },
  description:
    "One formula, unchanged since 1930: a green salad with walnuts, entrecôte carved twice, the secret Café de Paris sauce and endless golden fries. Reserve a table in Riyadh or AlUla.",
  openGraph: {
    title: "Entrecôte Café de Paris — Chez Boubier 1930",
    description:
      "One formula, unchanged since 1930. Reserve a table in Riyadh or AlUla.",
    type: "website",
    images: [{ url: "/brand/hero-formula.jpg", width: 2400, height: 1596 }],
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#001614",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${montserrat.variable} ${plexArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-green-900">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

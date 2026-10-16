import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";
import { SavedPropertiesProvider } from "./components/saved-properties";
import { site } from "./lib/site";
import SmoothScrollProvider from "./components/smooth-scroll-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: site.canonicalOrigin ? new URL(site.canonicalOrigin) : undefined,
  title: {
    default: `${site.displayName} | Dubai Property`,
    template: `%s | ${site.displayName}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.displayName} | Dubai Property`,
    description: site.description,
    type: "website",
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.displayName} | Dubai Property`,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScrollProvider>
          <SavedPropertiesProvider>
            <SiteHeader />
            <main className="site-main">{children}</main>
            <SiteFooter />
          </SavedPropertiesProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

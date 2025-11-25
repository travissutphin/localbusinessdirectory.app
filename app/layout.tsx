import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileNav from "@/components/MobileNav";
import GlobalHeader from "@/components/GlobalHeader";
import GlobalFooter from "@/components/GlobalFooter";

export const metadata: Metadata = {
  title: "My Home Based Business - Get Found by Local Customers | myhbb.app",
  description: "Free directory for home-based businesses. Get discovered by local customers searching for your services. List your business in 3 minutes—no ads, no fees, just visibility.",
  keywords: "home-based business directory, local business listings, free business directory, home business marketing, get found online, small business directory",
  openGraph: {
    title: "Get Your Home Business Found by Local Customers",
    description: "Join the free directory built for home-based businesses. Get discovered by people searching for exactly what you offer.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <GlobalHeader />
        {children}
        <GlobalFooter />
        <MobileNav />
      </body>
    </html>
  );
}

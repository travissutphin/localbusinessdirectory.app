import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3343L4R1SP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3343L4R1SP');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <GlobalHeader />
        {children}
        <GlobalFooter />
        <MobileNav />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileNav from "@/components/MobileNav";
import DesktopNav from "@/components/DesktopNav";

export const metadata: Metadata = {
  title: "Local Business Directory",
  description: "Find local businesses and services in your area",
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
        {children}
        <MobileNav />
        <DesktopNav />
      </body>
    </html>
  );
}

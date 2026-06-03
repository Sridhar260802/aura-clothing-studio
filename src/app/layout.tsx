import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: {
    default: "Aura Clothing Studio | Premium Fashion",
    template: "%s | Aura Clothing Studio",
  },
  description:
    "Discover premium clothing at Aura Clothing Studio. Luxury blazers, shirts, ethnic wear and more crafted with passion and elegance.",
  keywords: [
    "Aura Clothing",
    "premium fashion",
    "luxury clothing",
    "online shopping India",
    "designer wear",
    "blazers",
    "shirts",
    "ethnic wear",
  ],
  openGraph: {
    title: "Aura Clothing Studio | Premium Fashion",
    description:
      "Discover premium clothing crafted with passion. Luxury blazers, shirts, ethnic wear and more.",
    type: "website",
    locale: "en_IN",
    siteName: "Aura Clothing Studio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="grain">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

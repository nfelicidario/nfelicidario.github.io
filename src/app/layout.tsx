import type { Metadata } from "next";
import { Funnel_Display, Figtree } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const display = Funnel_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nolan Felicidario",
    template: "%s · Nolan Felicidario",
  },
  description:
    "Product designer who ships code. Senior product designer at Vibes, co-founder of Stride.",
  metadataBase: new URL("https://www.nolanfelicidario.com"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
